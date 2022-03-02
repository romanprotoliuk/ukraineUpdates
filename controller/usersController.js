const express = require('express');
const router = express.Router();
const db = require('../models');
const cryptojs = require('crypto-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/new', (req, res) => {
	res.render('new.ejs');
});

router.post('/', async (req, res) => {
	const [ newUser, created ] = await db.user.findOrCreate({ where: { email: req.body.email } });
	if (!created) {
		console.log('user already exists');
		res.render('users/login.ejs', { error: 'Looks like you already have an account! Try logging in :)' });
	} else {
		const hashedPassword = bcrypt.hashSync(req.body.password, 10);
		newUser.password = hashedPassword;
		newUser.firstName = req.body.firstName;
		newUser.lastName = req.body.lastName;
		newUser.userName = req.body.userName;
		await newUser.save();

		const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET);
		const encryptedUserIdString = encryptedUserId.toString();
		res.cookie('userId', encryptedUserIdString);
		res.redirect('/users/newsfeed');
	}
});

router.post('/login', async (req, res) => {
	const user = await db.user.findOne({ where: { email: req.body.email } });
	if (!user) {
		console.log('user not found');
		res.render('login.ejs', { error: 'Invalid email/password' });
	} else if (!bcrypt.compareSync(req.body.password, user.password)) {
		console.log('password incorrect');
		res.render('login.ejs', { error: 'Invalid email/password' });
	} else {
		console.log('logging in the user!!!');
		const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET);
		const encryptedUserIdString = encryptedUserId.toString();
		res.cookie('userId', encryptedUserIdString);
		res.redirect('/users/newsfeed');
	}
});

router.get('/login', (req, res) => {
	res.render('login.ejs');
});

router.get('/newsfeed', (req, res) => {
	res.render('newsfeed.ejs');
});

router.get('/profilejournal', async (req, res) => {
	res.render('profileJournal.ejs', {});
});

router.get('/profiletweets', async (req, res) => {
	res.render('profileTweets.ejs', {});
});

router.get('/noteform', (req, res) => {
	res.render('noteform.ejs');
});

router.post('/noteform', async (req, res) => {
	try {
		await db.note.create({
			subject: req.body.subject,
			url: req.body.link,
			description: req.body.textarea,
			userId: req.body.userId
		});
		console.log(req.body);

		res.redirect('/users/newsfeed');
	} catch (err) {
		console.log(err);
	}
});

router.get('/logout', (req, res) => {
	console.log('logging out');
	res.clearCookie('userId');
	res.redirect('/');
});

module.exports = router;
