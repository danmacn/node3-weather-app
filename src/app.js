const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const log = console.log;

const app = express();
const port = process.env.PORT || 3000;

// DEFINE PATHS FOR EXPRESS CONFIG
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Daniel Mac'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Daniel Mac'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        body: 'Lorem ipsum dolor sit amet.',
        name: 'Daniel Mac'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });

    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (rep, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found'
    });
});

app.get('*', (rep, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    log(`Server is up on port ${port}.`);
});