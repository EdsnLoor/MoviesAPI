const express = require('express'),
        morgan = require('morgan');
const app = express();

let movies = [
    {
        title: 'Donnie Darko',
        director: 'Richard Kelly, Chris Fisher'
    },
    {
        title: 'A Clockwork Orange',
        director: 'Stanley Kubrick'
    },
    {
        title: 'The Shining',
        director: 'Stanley Kubrick'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Inglourious Basterds',
        director: 'Quentin Tarantino'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson'
    },
    {
        title: 'Gladiator',
        director: 'Ridley Scott'
    },
];

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('This is a welcome page');
});
app.get('/movies', (req, res) => {
    res.send(movies);
});

app.use(express.static('public'));

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});