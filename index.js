const express = require('express'),
        morgan = require('morgan'),
        fs = require('fs'),
        path = require('path'),
        uuid = require('uuid'),
        bodyParser = require('body-parser');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Genres, Users and movies defined
let genres = {
    action : {
        name: 'Action',
        description:'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    horror : {
        name: 'Horror',
        description:'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes. '
    },
    drama : {
        name: 'Drama',
        description:'In film and television, drama is a category or genre of narrative fiction intended to be more serious than humorous in tone'
    },
    thriller : {
        name: 'Thriller',
        description:'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.'
    },
    scienceFiction : {
        name: 'Science fiction',
        description:'Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, mutants, interstellar travel, time travel, or other technologies.'
    },
    comedy : {
        name: 'Comedy',
        description:'A comedy film is a category of film which emphasizes humor.'
    },
    fantasy:{
        name: 'Fantasy',
        description: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
    }
}

let movies = [
    {
        title: 'Donnie Darko',
        director: 'Richard Kelly, Chris Fisher',
        genre: genres.thriller,
        imageURL:'https://upload.wikimedia.org/wikipedia/en/d/db/Donnie_Darko_poster.jpg'
    },
    {
        title: 'A Clockwork Orange',
        director: 'Stanley Kubrick',
        genre: genres.thriller,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/7/73/A_Clockwork_Orange_%281971%29.png'
    },
    {
        title: 'The Shining',
        director: 'Stanley Kubrick',
        genre: genres.horror,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        genre: genres.fantasy,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King_%282003%29.jpg'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        genre: genres.action,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher',
        genre: genres.thriller,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genre: genres.action,
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg'
    },
    {
        title: 'Inglourious Basterds',
        director: 'Quentin Tarantino',
        genre: genres.thriller,
        imageURL: 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_FMjpg_UX1000_.jpg'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson',
        genre: genres.fantasy,
        imageURL: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg'
    },
    {
        title: 'Gladiator',
        director: 'Ridley Scott',
        genre: genres.drama,
        imageURL: 'https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/41jDD6TfonL._AC_UF894,1000_QL80_.jpg'
    },
];

let users = [
    {
        id: '1',
        name: 'user1',
        movieList: [movies[0],movies[1]]
    },
    {
        id: '2',
        name: 'user2',
        movieList: []
    },
    {
        id: '3',
        name: 'user3',
        movieList: []
    }
]

// business logic
app.get('/', (req, res) => {
    res.send('This is a welcome page');
});

app.get('/documentation', (req, res) => {
    console.log('Documentation Request');
    res.sendFile('public/Documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// get a movie by title
app.get('/movies/:title', (req, res) => {
    const searchTerm = req.params.title.toLowerCase();
    const movie = movies.find(movie => movie.title.toLowerCase().includes(searchTerm));
    if (movie) {
        res.send(movie);
    } else {
        res.send('Movie not found');
    }
});

// get genre description
app.get('/genre/:genre', (req, res) => {
    const {genre} = req.params;
    const test = genres.
    console.log(test)
    // const searchTerm = req.params.title.toLowerCase();
    // const genre = genres.find(genre => genre.name.toLowerCase().includes(searchTerm));
    if (genre) {
        res.send(genre);
    } else {
        res.send('Genre not found');
    }
});

app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// create a user
app.post('/users', (req,res) => {
    const newUser = req.body;
    let validateUser = users.find(user=>user.name === newUser.name);
    if (newUser.name) {
        if (!validateUser){
            newUser.id = uuid.v4();
            users.push(newUser);
            res.status(201).json(newUser)
        } else {
            res.status(400).send('User name already exists')
        }
    }
    else {
        res.status(400).send('Name parameter is mandatory')
    }
});

// add a movie to a user
app.post('/users/:id', (req,res)=>{
    const {id} = req.params;
    const newMovie = req.body
    let addMovie = movies.find(movies=>movies.title === newMovie.title);
    let validateUser = users.find(user=>user.id === id);

    if(validateUser){
        if (addMovie){
            validateUser.movieList.push(addMovie);
            res.status(201).send(`${newMovie.title} has been added to ${validateUser.name}'s list`)
            console.log(newMovie);
        }
        else {
            res.status(400).send('The movie title does not exist');
        }
    }else{
        res.status(400).send('The user does not exist');
    }
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});