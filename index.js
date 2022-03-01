const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayout);

app.use('/users', require('./controller/usersController'));

app.get('/', (req, res) => {
	// send 'Hello, world' back to the client that made the request
	res.render('home.ejs');
});

app.get('/newsfeed', (req, res) => {
	res.render('newsfeed.ejs');
});

app.get('/profile', (req, res) => {
	res.render('profile.ejs');
});

// assign a port for our server to listen for incoming requests
app.listen(8000, () => {
	console.log("You're listening to the smooth sounds of port 8000");
});
