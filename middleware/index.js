const Campground = require('../models/campground');
const Comment = require('../models/comment');
const Review = require('../models/review');

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

middlewareObj.checkReviewOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Review.findById(req.params.review_id, (err, foundReview) => {
            if (err || !foundReview) {
                req.flash('error', 'Review not found')
                res.redirect('/campgrounds');
            } else {
                // does user own the comment?
                if (foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('/campgrounds');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate('reviews').exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found.');
                res.redirect('/campgrounds');
            } else {
                // check if req.user._id exists in foundCampground.reviews
                let foundUserReview = foundCampground.reviews.some((review) => {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash('error', 'You already wrote a review.');
                    return res.redirect('/campgrounds/' + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash('error', 'You need to login first.');
        res.redirect('/login');
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

module.exports = middlewareObj;