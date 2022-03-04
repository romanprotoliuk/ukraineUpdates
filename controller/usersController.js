const express = require('express');
const router = express.Router();
const db = require('../models');
const cryptojs = require('crypto-js');
const bcrypt = require('bcrypt');
const axios = require('axios');
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

router.get('/newsfeed', async (req, res) => {
	const bearerToken = process.env.BEARER_TOKEN;

	const accounts = [ `nexta_tv`, `ukraine` ];
	console.log(accounts);
	const options = {
		headers: {
			Authorization: `Bearer ${bearerToken}`
		}
	};

	try {
		const pedingPromises = accounts.map((account) =>
			// 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';
			axios.get(
				`https://api.twitter.com/2/tweets/search/recent?query=from:${account}&tweet.fields=created_at&expansions=author_id&user.fields=created_at`,
				options
			)
		);
		console.log(req.query);
		const responses = await Promise.all(pedingPromises);
		const tweets = [];
		responses.forEach((response, i) => {
			// console.log('$$$$$$$$$$$$$$$', response.data.data);
			response.data.data.forEach((tweet) => {
				tweets.push(tweet);
			});
		});

		console.log(tweets);
		// tweets.map(async (author) => {
		// 	const namesAccount = axios.get(`https://api.twitter.com/2/users/${author.author_id}`, options);
		// 	const responsesUserNames = await Promise.all(namesAccount);
		// 	console.log(responsesUserNames);
		// 	// return responsesUserNames;
		// });

		// 1891490382

		// const printAuthor = async () => {
		// 	const namesAccount = await axios.get(`https://api.twitter.com/labs/2/users/1891490382`, options);
		// 	console.log(namesAccount);
		// };

		// console.log(tweets);
		// printAuthor();

		// tweets.forEach(async (author) => {
		// 	authors.push(author.author_id);
		// 	const userName = await axios.get(`https://api.twitter.com/labs/2/users/${author.author_id}`, options);
		// });

		res.render('newsfeed.ejs', { dataAll: tweets });
	} catch (err) {
		console.log(err);
	}
});

router.get('/edit/:noteId', async (req, res) => {
	// select current user logged in id and then grab notId by req.params.id
	const note = await db.note.findOne({
		where: {
			id: req.params.noteId
		}
	});
	// console.log(note.id);
	res.render('edit.ejs', { note: note });
});

/////// new code
router.put('/edit/:noteId', async (req, res) => {
	await db.note.update(
		{
			subject: req.body.subject,
			description: req.body.textarea,
			url: req.body.link
		},
		{
			where: {
				id: req.body.noteId
			}
		}
	);
	res.redirect('/users/newsfeed');
	// res.redirect('/users/profile/:id');
});

router.delete('/:noteId', async (req, res) => {
	try {
		await db.note.destroy({
			where: {
				id: req.params.noteId
			}
		});
	} catch (err) {
		console.log(err);
	}
	res.redirect('/users/newsfeed');
});

router.get('/profilejournal/:id', async (req, res) => {
	try {
		const allData = await db.note.findAll({
			where: {
				userId: req.params.id
			}
		});
		// console.log(allData);
		res.render('profileJournal.ejs', { reports: allData });
	} catch (err) {
		console.log(err);
	}
});

router.get('/profiletweets/:id', async (req, res) => {
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
