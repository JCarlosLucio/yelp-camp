const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const campgrounds = [ //Temporary
    { name: 'Honey Badger Creek', image: 'https://source.unsplash.com/iZ4yhyDB-dQ' },
    { name: 'Sleepy Bear Hill', image: 'https://source.unsplash.com/Hxs6EAdI2Q8' },
    { name: 'Winter Fox Lake', image: 'https://source.unsplash.com/Czw5tWFGNOI' },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});
app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', { campgrounds: campgrounds });
});
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});
app.post('/campgrounds', (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.listen(3000, () => {
    console.log('Started yelp-camp server');
});