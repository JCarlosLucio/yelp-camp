const Campground = require('../models/campground');
const Comment = require('../models/comment');

// all the middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('/campgrounds');
            } else {
                //does user own the campground?
                // foundCampground is not equal to req.user._id in Type so...
                // don't use ===, use .equals() as below
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('/campgrounds');
                }
            };
        });
        // if not, redirect
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect('/login');
    }
}
middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found')
                res.redirect('/campgrounds');
            } else {
                //does user own the comment?
                // foundComment is not equal to req.user._id in Type so...
                // don't use ===, use .equals() as below
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('/campgrounds');
                }
            };
        });
        // if not, redirect
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    }
}
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

module.exports = middlewareObj;