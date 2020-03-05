const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

// SEEDDB
seedDB();

//DB CONNECT W/MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true })
    .catch((err) => {
        console.error('CONNECTION ERROR: ', err);
    });

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));

// EJS
app.set('view engine', 'ejs');

// ADD Campground
// Campground.create({
//     name: 'Rabbit Hop Valley',
//     image: 'https://source.unsplash.com/Hxs6EAdI2Q8',
//     description: 'This is a huge valley, no bathrooms. No water. Beautiful trees!'
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(`NEWLY CREATED CAMPGROUND: ${campground}`);
//     };
// });

// RESTFUL ROUTES
// name      url                 verb       description
//=========================================================================
// INDEX    /campgrounds         GET      Display a list of all campgrounds
// NEW      /campgrounds/new     GET      Display form to make a new campground
// CREATE   /campgrounds         POST     Add new campground to DB
// SHOW     /campgrounds/:id     GET      Shows info about one campground

app.get('/', (req, res) => {
    res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log('OH NO, ERROR!', err);
        } else {
            res.render('index', { campgrounds: allCampgrounds });
        }
    });
});

// CREATE - Add new campground to DB
app.post('/campgrounds', (req, res) => {
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = { name: name, image: image, description: desc };
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
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

// SHOW - Shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            // render show template with that campground
            res.render('show', { campground: foundCampground });
        };
    });
});

//SERVER
app.listen(3000, () => {
    console.log('Started yelp-camp server');
});