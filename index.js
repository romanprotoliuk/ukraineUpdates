require('dotenv').config();
const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./models');
const cryptojs = require('crypto-js');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayout);
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// AUTHENTICATION MIDDLEWARE
app.use(async (req, res, next) => {
	if (req.cookies.userId) {
		const decryptedId = cryptojs.AES.decrypt(req.cookies.userId, process.env.SECRET);
		const decryptedIdString = decryptedId.toString(cryptojs.enc.Utf8);
		const user = await db.user.findByPk(decryptedIdString);
		res.locals.user = user;
	} else res.locals.user = null;
	next();
});

app.use('/users', require('./controller/usersController'));
app.use('/signup', require('./controller/signupController'));
app.use('/login', require('./controller/loginController'));

app.get('/', (req, res) => {
	res.render('home.ejs');
});

// app.get('/about', (req, res) => {
// 	res.render('about.ejs');
// });

// app.get('/donations', (req, res) => {
// 	res.render('donations.ejs');
// });

app.listen(PORT, () => {
	console.log('It is live on port 8000');
});
