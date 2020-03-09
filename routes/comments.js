const express = require('express');
const router = express.Router({ mergeParams: true }); // use mergeParams so :id can pass from app.js
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ========================================
//              COMMENTS ROUTES
// ========================================

// RESTFUL ROUTES
// name      url                 verb       description
//=========================================================================
// INDEX    /campgrounds         GET      Display a list of all campgrounds
// NEW      /campgrounds/new     GET      Display form to make a new campground
// CREATE   /campgrounds         POST     Add new campground to DB
// SHOW     /campgrounds/:id     GET      Shows info about one campground
// NESTED ROUTES
//         /campgrounds/:id/comments/new    GET      Display form to make a new comment
//         /campgrounds/:id/comments/       POST     Add new comment to campground/:id

// NEW COMMENT - Display form to make a new comment
router.get('/new', isLoggedIn, (req, res) => {
    // find campground by id 
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            // render comments/new with campground data
            res.render('comments/new', { campground: campground });
        };
    });
});
// CREATE COMMENT - Add new comment to campground/:id
router.post('/', isLoggedIn, (req, res) => {
    // look up using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.error(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // connect new comment to campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    // redirect to campground show page
                    res.redirect(`/campgrounds/${campground._id}`);
                };
            });
        };
    });
});
// isLoggedIn - middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;