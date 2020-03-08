const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seeds = [
    {
        name: 'Honey Badger Creek',
        image: 'https://source.unsplash.com/iZ4yhyDB-dQ',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo. Ultricies mi eget mauris pharetra et ultrices neque ornare. Felis imperdiet proin fermentum leo vel orci porta non. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. Aenean pharetra magna ac placerat vestibulum. Gravida rutrum quisque non tellus. Turpis egestas integer eget aliquet. Sit amet aliquam id diam maecenas. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices.'
    },
    {
        name: 'Sleepy Bear Hill',
        image: 'https://source.unsplash.com/Hxs6EAdI2Q8',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo. Ultricies mi eget mauris pharetra et ultrices neque ornare. Felis imperdiet proin fermentum leo vel orci porta non. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. Aenean pharetra magna ac placerat vestibulum. Gravida rutrum quisque non tellus. Turpis egestas integer eget aliquet. Sit amet aliquam id diam maecenas. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices.'
    },
    {
        name: 'Winter Fox Lake',
        image: 'https://source.unsplash.com/Czw5tWFGNOI',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo. Ultricies mi eget mauris pharetra et ultrices neque ornare. Felis imperdiet proin fermentum leo vel orci porta non. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices. Aenean pharetra magna ac placerat vestibulum. Gravida rutrum quisque non tellus. Turpis egestas integer eget aliquet. Sit amet aliquam id diam maecenas. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices.'
    }
];

async function seedDB() {
    await Campground.deleteMany({});
    console.log('campgrounds removed');
    await Comment.deleteMany({});
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