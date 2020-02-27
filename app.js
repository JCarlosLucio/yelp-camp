const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});
app.get('/campgrounds', (req, res) => {
    const campgrounds = [
        {name: 'Honey Badger Creek', image: 'https://source.unsplash.com/iZ4yhyDB-dQ'},
        {name: 'Sleepy Bear Hill', image: 'https://source.unsplash.com/Hxs6EAdI2Q8'},
        {name: 'Winter Fox Lake', image: 'https://source.unsplash.com/Czw5tWFGNOI'},
    ];
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, () => {
    console.log('Started yelp-camp server');
});