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
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
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
        failureRedirect: '/login'
    }
), (req, res) => { });
// LOGOUT 
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});
// isLoggedIn - middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;