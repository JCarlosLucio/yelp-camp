const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

// ROUTES require
const campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

//DB CONNECT W/MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true })
    .catch((err) => {
        console.error('CONNECTION ERROR: ', err);
    });
// BODY PARSER
// used to pass info (i.e. req.body.name)
app.use(bodyParser.urlencoded({ extended: true }));
// EJS
app.set('view engine', 'ejs');
// CUSTOM CSS
app.use(express.static(__dirname + '/public'));
// SEEDDB
// function to seed DB to help test site
seedDB();

// PASSPORT CONFIGURATION
//used for authentication
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass currentUser info to every route
// same as this example:
// === res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user }); ===
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

//ROUTES
// the first parameter makes every route in the specified file take the starting url
// example: for routes/campgrounds.js all routes started with /campgrounds so we simplified them by 
// giving it here.
app.use('/campgrounds', campgroundRoutes);
// when using :id or similar use {mergeParams: true} on router  when requiring it in the route file
app.use('/campgrounds/:id/comments', commentRoutes);
// in this case index doesn't take the first argument since all of its routes start differently
app.use(indexRoutes);

//SERVER
app.listen(3000, () => {
    console.log('Started yelp-camp server');
});