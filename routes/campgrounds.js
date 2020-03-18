const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
// use ../middleware instead of ../middleware/index because index is a special name for a file to be called
const middleware = require('../middleware');

// ===== Node-Geocoder Config ======
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
const geocoder = NodeGeocoder(options);

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
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ $or: [{ name: regex, }, { location: regex }, { "author.username": regex }] }, (err, allCampgrounds) => {
            if (err) {
                console.log('OH NO, ERROR!', err);
            } else {
                if (allCampgrounds.length < 1) {
                    req.flash('error', `Your search - "${req.query.search}" - did not match any campgrounds.`);
                    res.redirect('/campgrounds');
                } else {
                    res.render('campgrounds/index', { campgrounds: allCampgrounds });
                }
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err) {
                console.log('OH NO, ERROR!', err);
            } else {
                res.render('campgrounds/index', { campgrounds: allCampgrounds });
            }
        });
    }
});

// CREATE - Add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log('GEOCODER ERROR', err);
            req.flash('error', 'Invalid address');
            return res.redirect('/campgrounds');
        }
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].formattedAddress;
        let newCampground = {
            name: name,
            price: price,
            image: image,
            author: author,
            description: desc,
            location: location,
            lat: lat,
            lng: lng
        };
        //create a new campground and save to DB
        Campground.create(newCampground, (err, newlyCreated) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Could not add new campground');
                res.redirect('/campgrounds');
            } else {
                //redirect to campground page
                req.flash('success', 'Successfully added campground');
                res.redirect('/campgrounds');
            };
        });
    });
});

// NEW - Show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - Shows more info about one campground
router.get('/:id', (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            // console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        };
    });
});

// EDIT - Edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// UPDATE - Update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || !data.length) {
            console.log('GEOCODER UPDATE ERROR', err);
            req.flash('error', 'Invalid address');
            return res.redirect('/campgrounds');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        // find and update the correct campground
        // req.body.campground comes from  the form (name=) that is set up as "campground[name], campground[image]..."
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/campgrounds');
            } else {
                // redirect somewhere (show page)
                req.flash("success", "Successfully Updated");
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });
});

// DESTROY - Delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and remove the correct campground
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            res.redirect('/campgrounds');
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash('success', 'Campground deleted');
            res.redirect('/campgrounds');
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;