const express = require('express');
const router = express.Router();
const db = require('../models');
require('dotenv').config();

router.get('/journal', async (req, res) => {
	if (req.cookies.userId) {
		try {
			const allData = await db.note.findAll({
				where: {
					userId: res.locals.user.id
				}
			});
			res.render('profileJournal.ejs', { reports: allData });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/login');
	}
});

router.get('/tweets', async (req, res) => {
	if (req.cookies.userId) {
		try {
			const allTweets = await res.locals.user.getTweets();
			res.render('profileTweets.ejs', { tweets: allTweets });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
