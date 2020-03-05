const mongoose = require('mongoose');
const Campground = require('./models/campground');

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('removed campgrounds');
        };
    });
};
module.exports = seedDB;