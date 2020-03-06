const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seeds = [
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

async function seedDB() {
    await Campground.remove({});
    console.log('campgrounds removed');
    await Comment.remove({});
    console.log('comments removed');
    for (const seed of seeds) {
        let campground = await Campground.create(seed);
        console.log('campground created');
        let comment = await Comment.create(
            {
                text: 'This place is great but I wish there was Internet!',
                author: 'Homer'
            }
        );
        console.log('comment created');
        campground.comments.push(comment);
        campground.save();
        console.log('comment added to campground');
    };
};

module.exports = seedDB;