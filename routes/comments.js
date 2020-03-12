const express = require('express');
const router = express.Router({ mergeParams: true }); // use mergeParams so :id can pass from app.js
const Campground = require('../models/campground');
const Comment = require('../models/comment');
// use ../middleware instead of ../middleware/index because index is a special name for a file to be called
const middleware = require('../middleware');

// ========================================
//              COMMENTS ROUTES
// ========================================

// RESTFUL ROUTES
// name             path           http verb               description                         mongoose method
//===============================================================================================================
// INDEX     /campgrounds             GET      Display a list of all campgrounds             .find()
// NEW       /campgrounds/new         GET      Display form to make a new campground         N/A
// CREATE    /campgrounds             POST     Add new campground to DB, then redirect       .create()
// SHOW      /campgrounds/:id         GET      Shows info about one specific campground      .findById()
// EDIT      /campgrounds/:id/edit    GET      Shows edit form for one campground            .findById()
// UPDATE    /campgrounds/:id         PUT      Update particular campground, then redirect   .findByIdAndUpdate()
// DESTROY   /campgrounds/:id         DELETE   Delete particular campground, then redirect   .findByIdAndRemove()
// NESTED ROUTES ================================================================================================
// They all use /campgrounds/:id/comments because they are nested.(As shown in the routes in app.js)
//  NEW      /new                     GET      Display form to make a new comment      N/A
//  CREATE   /                        POST     Add new comment to campground/:id       .create()
//  EDIT     /:comment_id/edit        GET      Shows edit form for specific comment    .findById()
//  UPDATE   /:comment_id             PUT      Update specific comment, then redirect  .findByIdAndUpdate()
//  DESTROY  /:comment_id             DELETE   Delete specific comment, then redirect  .findByIdAndRemove()

// NEW COMMENT - Display form to make a new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
// EDIT - Shows edit form for specific comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
        }
    });
});
// UPDATE - Update specific comment, then redirect
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// DESTROY - Delete specific comment, then redirect
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;