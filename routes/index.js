const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

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

module.exports = router;