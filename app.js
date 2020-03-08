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
// CUSTOM CSS
app.use(express.static(__dirname + '/public'));

// SEEDDB
seedDB();

// PASSPORT CONFIGURATION
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

app.get('/', (req, res) => {
    res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log('OH NO, ERROR!', err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
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
    res.render('campgrounds/new');
});

// SHOW - Shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        };
    });
});

// ========================================
//              COMMENTS ROUTES
// ========================================

// NEW COMMENT - Display form to make a new comment
app.get('/campgrounds/:id/comments/new', (req, res) => {
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
app.post('/campgrounds/:id/comments', (req, res) => {
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
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log('Created NEW comment');
                    // redirect to campground show page
                    res.redirect(`/campgrounds/${campground._id}`);
                };
            });
        };
    });
});

// ========================================
//              AUTH ROUTES
// ========================================

// REGISTER - Show register form
app.get('/register', (req, res) => {
    res.render('register');
});
// REGISTER - Handle signup logic
app.post('/register', (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN - Show login form
app.get('/login', (req, res) => {
    res.render('login');
});
// LOGIN - Handle login logic
app.post('/login', passport.authenticate('local',
    //middleware
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }
), (req, res) => { });

// LOGOUT 
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

// isLoggedIn - middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

//SERVER
app.listen(3000, () => {
    console.log('Started yelp-camp server');
});