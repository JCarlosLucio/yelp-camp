const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ROOT ROUTE
router.get('/', (req, res) => {
    res.render('landing');
});

// ========================================
//              AUTH ROUTES
// ========================================

// REGISTER - Show register form
router.get('/register', (req, res) => {
    res.render('register');
});
// REGISTER - Handle signup logic
router.post('/register', (req, res) => {
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.email
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});
// LOGIN - Show login form
router.get('/login', (req, res) => {
    res.render('login');
});
// LOGIN - Handle login logic
router.post('/login', passport.authenticate('local',
    //middleware
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp!'
    }
), (req, res) => { });
// LOGOUT 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

// FORGOT PASSWORD 
// FORGOT GET - Shows the forgot page
router.get('/forgot', (req, res) => {
    res.render('forgot');
});
// FORGOT POST - Handles the logic to create, use and mail token to user
router.post('/forgot', (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    if(err) {
                        req.flash('error', 'Something went wrong, please try again in a few minutes');
                        return res.redirect('/forgot');
                    }
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'botwebdev3@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'botwebdev3@gmail.com',
                subject: 'YelpCamp Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                // Added error handling
                if (err) {
                    req.flash('error', 'Something went wrong');
                    res.redirect('/forgot');
                }
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

// RESET PASSWORD
// RESET GET - Show reset password page
router.get('/reset/:token', (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});
// RESET POST - Handle reset password logic
router.post('/reset/:token', (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired');
                    return res.redirect('/forgot');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save((err) => {
                            if(err) {
                                req.flash('error', 'Something went wrong, please try again in a few minutes');
                                return res.redirect('..');
                            }
                            req.logIn(user, (err) => {
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash('error', 'Passwords do not match');
                    return res.redirect('..');
                }
            });
        },
        function (user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'botwebdev3@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'botwebdev3@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello, \n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                // Added error handling
                if (err) {
                    req.flash('error', 'Something went wrong');
                    res.redirect('..');
                }
                req.flash('success', 'Success! Your password has been changed');
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            req.flash('error', 'Oops something went wrong!');
            return res.redirect('/campgrounds');
        }
        res.redirect('/campgrounds');
    });
});

// USER PROFILE - Show users profile
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/campgrounds');
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function (err, campgrounds) {
            if (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/campgrounds');
            }
            res.render('users/show', { user: foundUser, campgrounds: campgrounds });
        });
    });
});

module.exports = router;