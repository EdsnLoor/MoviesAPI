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
let genres = [
    {
        name: 'Action',
        description:'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    {
        name: 'Horror',
        description:'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes. '
    },
    {
        name: 'Drama',
        description:'In film and television, drama is a category or genre of narrative fiction intended to be more serious than humorous in tone'
    },
    {
        name: 'Thriller',
        description:'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.'
    },
    {
        name: 'Comedy',
        description:'A comedy film is a category of film which emphasizes humor.'
    },
    {
        name: 'Fantasy',
        description: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
    }
]

let movies = [
    {
        title: 'Donnie Darko',
        director: {
            name: 'Richard Kelly',
            bio: 'James Richard Kelly is an American filmmaker and screenwriter, who initially gained recognition for writing and directing the cult classic Donnie Darko in 2001.',
            dateOfBirth: '1975',
            dateOfDead: 'present'
        },
        genre: genres[3],
        imageURL:'https://upload.wikimedia.org/wikipedia/en/d/db/Donnie_Darko_poster.jpg'
    },
    {
        title: 'A Clockwork Orange',
        director: {
            name: 'Stanley Kubrick',
            bio: 'Stanley Kubrick was an American film director, producer and screenwriter. Widely considered one of the greatest filmmakers of all time.',
            dateOfBirth: '1928',
            dateOfDead: '1999'
        },
        genre: genres[3],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/7/73/A_Clockwork_Orange_%281971%29.png'
    },
    {
        title: 'The Shining',
        director: {
            name: 'Stanley Kubrick',
            bio: 'Stanley Kubrick was an American film director, producer and screenwriter. Widely considered one of the greatest filmmakers of all time.',
            dateOfBirth: '1928',
            dateOfDead: '1999'
        },
        genre: genres[1],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy.',
            dateOfBirth: '1961',
            dateOfDead: 'present'
        },
        genre: genres[5],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King_%282003%29.jpg'
    },
    {
        title: 'The Dark Knight',
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling.',
            dateOfBirth: '1970',
            dateOfDead: 'present'
        },
        genre: genres[0],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
    },
    {
        title: 'Fight Club',
        director: {
            name: 'David Fincher',
            bio: 'David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director.',
            dateOfBirth: '1962',
            dateOfDead: 'present'
        },
        genre: genres[3],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg'
    },
    {
        title: 'Pulp Fiction',
        director: {
            name: 'Quentin Tarantino',
            bio: 'Quentin Jerome Tarantino is an American film director, writer, producer, and actor. His films are characterized by stylized violence, extended dialogue including the pervasive use of profanity and references to popular culture.',
            dateOfBirth: '1963',
            dateOfDead: 'present'
        },
        genre: genres[0],
        imageURL: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg'
    },
    {
        title: 'Inglourious Basterds',
        director: {
            name: 'Quentin Tarantino',
            bio: 'Quentin Jerome Tarantino is an American film director, writer, producer, and actor. His films are characterized by stylized violence, extended dialogue including the pervasive use of profanity and references to popular culture.',
            dateOfBirth: '1963',
            dateOfDead: 'present'
        },
        genre: genres[3],
        imageURL: 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_FMjpg_UX1000_.jpg'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy.',
            dateOfBirth: '1961',
            dateOfDead: 'present'
        },
        genre: genres[5],
        imageURL: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg'
    },
    {
        title: 'Gladiator',
        director: {
            name: 'Ridley Scott',
            bio: 'Sir Ridley Scott is an English film director and producer. Best known for directing films in the science fiction and historical drama genres.',
            dateOfBirth: '1937',
            dateOfDead: 'present'
        },
        genre: genres[2],
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

// Get all users and movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// get a movie by title
app.get('/movies/:title', (req, res) => {
    const searchTitle = req.params.title.toLowerCase();
    const movie = movies.find(movie => movie.title.toLowerCase().includes(searchTitle));
    if (movie) {
        res.send(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// get genre description
app.get('/genres/:genreName', (req, res) => {
    const genre = genres.find(genre => genre.name.toLowerCase() === req.params.genreName.toLowerCase());
    if (genre) {
        res.send(genre);
    } else {
        res.status(404).send('Genre not found');
    }
});

// Get director's information
app.get('/director/:name', (req, res) => {
    const searchName = req.params.name.toLowerCase();
    const movie = movies.find(movie => movie.director.name.toLowerCase().includes(searchName));

    if (!movie) {
        return res.status(404).send('Director not found');
    }

    res.send(movie.director);
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
            res.status(400).send('Movie not found');
        }
    }else{
        res.status(400).send('User not found');
    }
});

app.put('/users/:id', (req, res)=>{
    const {id}=req.params;
    const userUpdate=req.body;

    let user=users.find(user=>user.id === id);

    if(user){
        user.name=userUpdate.name;
        res.status(201).json(user);
    }else{
        res.status(400).send('cannot update');
    }
});


//DELTE
app.delete('/users/:id/:movieTitle', (req,res)=>{
    const {id, movieTitle} =req.params;

    let user = users.find(user=>user.id ===id);

    if(user){
        user.movieList=user.movieList.filter(title=>title !== movieTitle);
        res.status(201).send(`${movieTitle} has been removed from your list`);
    }else{
        res.status(400).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;

    let user = users.find(user => user.id === id );

    if (user) {
        users = users.filter(user => user.id !== req.params.id);
        res.status(201).send('User account ' + req.params.id + ' was deleted.');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.send('Error');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});