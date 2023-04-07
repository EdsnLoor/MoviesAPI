const express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        path = require('path'),
        uuid = require('uuid'),
        bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const Models = require ('./models');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesAPI', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// business logic
app.get('/', (req, res) => {
    res.send('This is a welcome page');
});

app.get('/documentation', (req, res) => {
    console.log('Documentation Request');
    res.sendFile('public/Documentation.html', {root: __dirname});
});

// Get all users and movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.json(user);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ title: req.params.Title })
        .then((movies) => {
            if (!movies) {
                res.status(400).send(req.params.Title + ' was not found');
            } else {
                res.status(200).json(movies);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get genre description
app.get('/genres/:Genre', (req, res) => {
    Movies.find({ 'genre.name' : req.params.Genre })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.Genre + ' was not found');
            } else {
                res.json(movie[0].genre);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get all movies by genre
app.get('/movies/genres/:Genre', (req, res) => {
    Movies.find({ 'genre.name' : req.params.Genre })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.Genre + ' was not found');
            } else {
                res.json(movie);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get director's information
app.get('/directors/:Name', (req, res) => {
    Movies.find({ 'director.name' : req.params.Name })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.Name + ' was not found');
            } else {
                res.json(movie[0].director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// get all movies by director
app.get('/movies/directors/:Name', (req, res) => {
    Movies.find({ 'director.name' : req.params.Name })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.Name + ' was not found');
            } else {
                res.json(movie);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// add new user
app.post('/users', (req, res) => {
    Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.username + ' already exists');
            } else {
                Users
                    .create({
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// update user's information
app.put('/users/:id', async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        } else {
            const updatedUser = await Users.findOneAndUpdate({ _id: req.params.id }, { $set: {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday
                }}, { new: true });

            res.json(updatedUser);
        }
    } catch(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Add a movie to a user
app.put('/users/:id/movies', async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.params.id });
        const movie = await Movies.findOne({ _id: req.body.movieID });
        if (!user) {
            return res.status(404).send('User not found');
        } else if (!movie){
            return res.status(404).send('Movie not found');
        }else {
            const updatedUser = await Users.findOneAndUpdate({ _id: req.params.id }, { $push: {
                    FavoriteMovies: req.body.movieID
                }}, { new: true });
            res.json(updatedUser);
        }
    } catch(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// delete a movie for a user's FavoritesMovies list
app.delete('/users/:id/movies', async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.params.id });
        const movie = await Movies.findOne({ _id: req.body.movieID });
        if (!user) {
            return res.status(404).send('User not found');
        } else if (!movie){
            return res.status(404).send('Movie not found');
        }else {
            const updatedUser = await Users.findOneAndUpdate({ _id: req.params.id }, { $pull: {
                    FavoriteMovies: req.body.movieID
                }}, { new: true });
            res.json(updatedUser);
        }
    } catch(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// delete user by id
app.delete('/users/:id', (req, res) => {
    Users.findOneAndRemove({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                res.status(400).send(user.username + ' was not found');
            } else {
                res.status(200).send(user.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.send('Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});