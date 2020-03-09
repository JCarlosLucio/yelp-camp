const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// ========================================
//              CAMPGROUNDS ROUTES
// ========================================

// RESTFUL ROUTES
// name      url                 verb       description
//=========================================================================
// INDEX    /campgrounds         GET      Display a list of all campgrounds
// NEW      /campgrounds/new     GET      Display form to make a new campground
// CREATE   /campgrounds         POST     Add new campground to DB
// SHOW     /campgrounds/:id     GET      Shows info about one campground

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
// isLoggedIn - middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;