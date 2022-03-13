const express = require('express');
const router = express.Router();
const db = require('../models');
const cryptojs = require('crypto-js');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config();

router.post('/', async (req, res) => {
	if (req.cookies.userId) {
		try {
			await db.note.create({
				subject: req.body.subject,
				url: req.body.link,
				description: req.body.textarea,
				userId: req.body.userId
			});
			console.log(req.body);

			res.redirect('/tweets');
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/login');
	}
});

// find one note and compare it to the user id
router.get('/edit/:noteId', async (req, res) => {
	if (req.cookies.userId) {
		const note = await db.note.findOne({
			where: {
				id: req.params.noteId
			}
		});
		res.render('edit.ejs', { note: note });
	} else {
		res.redirect('/login');
	}
});

// find the note first
// and then edit it
router.put('/edit/:noteId', async (req, res) => {
	if (req.cookies.userId && res.locals.user) {
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
		res.redirect('/tweets');
	} else {
		res.redirect('/login');
	}
});

router.delete('/:noteId', async (req, res) => {
	if (req.cookies.userId && res.locals.user) {
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
		res.redirect('/login');
	}
	res.redirect('/tweets');
});

router.delete('/:Id/tweet', async (req, res) => {
	if (req.cookies.userId && res.locals.user) {
		try {
			const tweet = req.params.Id;
			// console.log(tweet);
			const user = res.locals.user;
			await user.removeTweet(tweet);
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/login');
	}
	res.redirect('/tweets');
});

router.get('/', (req, res) => {
	res.render('noteform.ejs');
});

module.exports = router;
