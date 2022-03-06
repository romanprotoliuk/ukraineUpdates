const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
require('dotenv').config();

router.get('/newsfeed', async (req, res) => {
	if (req.cookies.userId) {
		const bearerToken = process.env.BEARER_TOKEN;
		const accounts = [ `nexta_tv`, `ukraine` ];
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
			const responses = await Promise.all(pedingPromises);
			const tweets = [];
			responses.forEach((response) => {
				response.data.data.forEach((tweet) => {
					tweets.push(tweet);
				});
			});

			console.log(tweets);
			res.render('newsfeed.ejs', { dataAll: tweets });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/users/login');
	}
});

router.get('/edit/:noteId', async (req, res) => {
	if (req.cookies.userId) {
		const note = await db.note.findOne({
			where: {
				id: req.params.noteId
			}
		});
		res.render('edit.ejs', { note: note });
	} else {
		res.redirect('/users/login');
	}
});

/////// new code
router.put('/edit/:noteId', async (req, res) => {
	if (req.cookies.userId) {
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
	} else {
		res.redirect('/users/login');
	}
});

router.delete('/:noteId', async (req, res) => {
	if (req.cookies.userId) {
		try {
			await db.note.destroy({
				where: {
					id: req.params.noteId
				}
			});
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/users/login');
	}
	res.redirect('/users/newsfeed');
});

router.get('/profilejournal/:id', async (req, res) => {
	if (req.cookies.userId) {
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
	} else {
		res.redirect('/users/login');
	}
});

router.get('/profiletweets/:id', async (req, res) => {
	res.render('profileTweets.ejs');
});

router.get('/noteform', (req, res) => {
	res.render('noteform.ejs');
});

router.post('/noteform', async (req, res) => {
	if (req.cookies.userId) {
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
	} else {
		res.redirect('/users/login');
	}
});

router.post('/add-tweet', async (req, res) => {
	// protect this route
	// if (req.cookies.userId) {
	// } else {
	// 	res.redirect('/users/login');
	// }

	try {
		// const [ user, userCreated ] = await db.user.findOrCreate({
		// 	where: {
		// 		userId: req.local.user
		// 	}
		// });

		const user = res.locals.user;
		const [ tweet, tweetCreated ] = await db.tweet.findOrCreate({
			where: {
				tweetId: req.body.tweetId,
				text: req.body.text,
				author_id: req.body.author_id
			}
		});

		console.log(tweetCreated);
		await user.addTweet(tweetCreated);
		console.log(`${tweet.type} added to ${user.firstName}.`);
	} catch (error) {}
	res.redirect('/users/newsfeed');
	console.log(req.body);
});
// try {
// 	await db.tweet.create({
// tweetId: req.body.tweetId,
// text: req.body.text,
// author_id: req.body.author_id,
// userId: req.body.userId
// 	});
// 	console.log(req.body);

// 	res.redirect('/users/newsfeed');
// } catch (err) {
// 	console.log(err);
// }

router.get('/logout', (req, res) => {
	console.log('logging out');
	res.clearCookie('userId');
	res.redirect('/');
});

module.exports = router;

// findOrcreate,
// res.local.user
