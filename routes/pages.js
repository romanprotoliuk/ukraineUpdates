const router = require('express').Router();

router.get('/', (req, res) => {
	res.render('home.ejs');
});

router.get('/signup', (req, res) => {
	res.render('new.ejs');
});

router.get('/login', (req, res) => {
	res.render('login.ejs');
});

router.get('/logout', (req, res) => {
	console.log('logging out');
	res.clearCookie('userId');
	res.redirect('/');
});
module.exports = router;
