const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const data = [
    {
        name: 'Honey Badger Creek',
        image: 'https://source.unsplash.com/iZ4yhyDB-dQ',
        description: 'blah blah blah'
    },
    {
        name: 'Sleepy Bear Hill',
        image: 'https://source.unsplash.com/Hxs6EAdI2Q8',
        description: 'bleh bleh bleh'
    },
    {
        name: 'Winter Fox Lake',
        image: 'https://source.unsplash.com/Czw5tWFGNOI',
        description: 'bluh bluh bluh'
    }
];

function seedDB() {
    // Remove all comments
    Comment.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('removed comments');
            // Remove all campgrounds
            Campground.remove({}, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('removed campgrounds');
                    // Add a few campgrounds
                    data.forEach((seed) => {
                        Campground.create(seed, (err, campground) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log('added campground');
                                // Add a few comments
                                Comment.create(
                                    {
                                        text: 'This place is great but I wish there was Internet!',
                                        author: 'Homer'
                                    }, (err, comment) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                            console.log('Created new comment');
                                        };
                                    }
                                );
                            };
                        });
                    });
                };
            });
        };
    })
};
module.exports = seedDB;