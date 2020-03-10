const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ========================================
//              CAMPGROUNDS ROUTES
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

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log('OH NO, ERROR!', err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

// CREATE - Add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = { name: name, image: image, author: author, description: desc };
    //create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            //redirect to campground page
            res.redirect('/campgrounds');
        };
    });
});

// NEW - Show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - Shows more info about one campground
router.get('/:id', (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        };
    });
});

// EDIT - Edit campground route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// UPDATE - Update campground route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    // req.body.campground comes from  the form (name=) that is set up as "campground[name], campground[image]..."
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            // redirect somewhere (show page)
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY - Delete campground
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    // find and remove the correct campground
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            res.redirect('/campgrounds');
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

// MIDDLEWARE
// isLoggedIn
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
// checkCampgroundOwnership
function checkCampgroundOwnership(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('back');
            } else {
                //does user own the campground?
                // foundCampground is not equal to req.user._id in Type so...
                // don't use ===, use .equals() as below
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            };
        });
        // if not, redirect
    } else {
        res.redirect('back');
    }
}
module.exports = router;