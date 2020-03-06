const mongoose = require('mongoose');
const Campground = require('./models/campground');

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
    // Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('removed campgrounds');
            // Add a few campgrounds
            data.forEach((seed) =>{
                Campground.create(seed, (err, data)=> {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('added campground');
                    };
                });
            });
        };
    });
    // Add a few comments
};
module.exports = seedDB;