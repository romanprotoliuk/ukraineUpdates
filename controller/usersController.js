const express = require('express');
const router = express.Router();

router.get('/new', (req, res) => {
	res.render('new.ejs');
});

router.get('/login', (req, res) => {
	res.render('login.ejs');
});

module.exports = router;
