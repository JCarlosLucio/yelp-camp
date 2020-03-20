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
router.get('/forgot', (req, res) => {
    res.render('/forgot');
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