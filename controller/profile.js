const express = require('express');
const router = express.Router();
const db = require('../models');
require('dotenv').config();

/** 
 * @desc    Get all journal
 * @route   GET /profile/
 * @access  Private
 * @Query_Params "" , ""
 */

module.exports.getAllJournal = async (req, res) => {
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
};

/** 
 * @desc    Get all journal
 * @route   GET /profile/
 * @access  Private
 * @Query_Params "" , ""
 */

module.exports.getAllTweets = async (req, res) => {
	try {
		const allTweets = await res.locals.user.getTweets();
		res.render('profileTweets.ejs', { tweets: allTweets });
	} catch (err) {
		console.log(err);
	}
};
