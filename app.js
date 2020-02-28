const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});
app.get('/campgrounds', (req, res) => {
    const campgrounds = [
        { name: 'Honey Badger Creek', image: 'https://source.unsplash.com/iZ4yhyDB-dQ' },
        { name: 'Sleepy Bear Hill', image: 'https://source.unsplash.com/Hxs6EAdI2Q8' },
        { name: 'Winter Fox Lake', image: 'https://source.unsplash.com/Czw5tWFGNOI' },
    ];
    res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
    res.send('HIT POST ROUTE');
});
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen(3000, () => {
    console.log('Started yelp-camp server');
});