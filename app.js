require('dotenv').config();

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    // seedDB = require('./seeds'),
    methodOverride = require('method-override');

// ROUTES require
const campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    reviewRoutes = require('./routes/reviews'),
    indexRoutes = require('./routes/index');

// DB CONNECT W/MONGOOSE
// LOCAL DB - 'mongodb://localhost:27017/yelp_camp'
// DEPLOYMENT DB EXAMPLE - 'mongodb+srv://<user>:<password>@<cluster>-r1vdx.mongodb.net/test?retryWrites=true&w=majority'
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp_camp';
// mongoose.set('useCreateIndex', true);  // When using {unique: true} on models
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
// Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false
mongoose.connect(databaseUri).then(() => {
    console.log('Connected to DB!');
}).catch((err) => {
    console.log('CONNECTION ERROR: ', err.message);
});
// BODY PARSER
// used to pass info (i.e. req.body.name)
app.use(bodyParser.urlencoded({ extended: true }));
// EJS
app.set('view engine', 'ejs');
// CUSTOM CSS
app.use(express.static(__dirname + '/public'));
// METHOD-OVERRIDE
// used to override UPDATE(app.put) and DESTROY(app.delete) routes
app.use(methodOverride('_method'));
// CONNECT-FLASH
app.use(flash());
// MOMENT JS -to be able to use moment in all our view files
app.locals.moment = require('moment');
// SEEDDB
// function to seed DB to help test site
// seedDB();

// PASSPORT CONFIGURATION
//used for authentication
app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass info to every route
// same as this example:
// pass currentUser info
// === res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user }); ===
app.use((req, res, next) => {
    //pass currentUser info
    res.locals.currentUser = req.user;
    //pass error/success message from flash
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
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
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(indexRoutes);

//SERVER
app.listen(process.env.PORT || 3000, () => {
    console.log('Started yelp-camp server');
});