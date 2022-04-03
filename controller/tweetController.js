const express = require('express');
const router = express.Router();
const db = require('../models');
require('dotenv').config();

router.post('/', async (req, res) => {
	if (req.cookies.userId) {
		try {
			const [ tweet ] = await db.tweet.findOrCreate({
				where: {
					tweetId: req.body.tweetid,
					text: req.body.text,
					author_id: req.body.author_id
				}
			});
			const user = res.locals.user;
			await user.addTweet(tweet);
			res.redirect('/tweets');
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
