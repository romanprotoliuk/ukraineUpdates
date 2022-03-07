const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
require('dotenv').config();

// `ukraine`, `zelenskyyUa`, `walterlekh`, ``

router.get('/newsfeed', async (req, res) => {
	if (req.cookies.userId) {
		const bearerToken = process.env.BEARER_TOKEN;
		const accounts = [ `nexta_tv`, `ukraine`, `zelenskyyUa`, `walterlekh` ];
		const options = {
			headers: {
				Authorization: `Bearer ${bearerToken}`
			}
		};

		try {
			const pedingPromises = accounts.map((account) =>
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
			// console.log(tweets);
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
			res.render('profileJournal.ejs', { reports: allData });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/users/login');
	}
});

router.get('/profiletweets/:id', async (req, res) => {
	if (req.cookies.userId) {
		try {
			const allData = await db.tweet.findAll({
				where: {
					userId: req.params.id
				}
			});
			res.render('profileTweets.ejs', { tweets: allData });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/users/login');
	}
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
	if (req.cookies.userId) {
		try {
			await db.tweet.create({
				tweetId: req.body.tweetid,
				text: req.body.text,
				author_id: req.body.author_id,
				userId: req.body.userid
			});

			console.log(req.body);
			res.redirect('/users/newsfeed');
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect;
	}
});

router.delete('/tweet/:Id', async (req, res) => {
	if (req.cookies.userId) {
		try {
			await db.tweet.destroy({
				where: {
					id: req.params.Id
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

/* This solution is not working */
// try {
// 	const userFound = await db.user.findOne({
// 		where: {
// 			id: res.locals.user.id
// 		}
// 	});
// 	console.log('$$$$$$$$$$$$$', userFound);
// const [ tweet, tweetCreated ] = await db.tweet.findOrCreate({
// 	where: {
// 		tweetId: req.body.tweetid,
// 		text: req.body.text,
// 		author_id: req.body.author_id
// 	}

// 	console.log('$$$$$$$$$$$$$#########', tweet);
// 	await tweet.createTweet(userFound);
// 	console.log(`${tweet.type} added to ${user.firstName}.`);
// } catch (error) {}
// res.redirect('/users/newsfeed');
// console.log('@@@@@@@@@@@@@@@@@@@@@@@@', req.body);

/* This solution is not working */
// 	if (res.locals.user) {
// 		try {
// 			const [ tweet, tweetCreated ] = await db.tweet.findOrCreate({
// 				where: {
// 					//
// 					tweetId: req.body.tweetid,
// 					text: req.body.text,
// 					author_id: req.body.author_id
// 				}
// 			});
// 			await tweet.addUser(res.locals.user.id);
// 		} catch (error) {}
// 	}
// });

router.get('/logout', (req, res) => {
	console.log('logging out');
	res.clearCookie('userId');
	res.redirect('/');
});

module.exports = router;
