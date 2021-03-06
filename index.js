const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./models');
const cryptojs = require('crypto-js');
const bcrypt = require('bcrypt');
const moment = require('moment');
const axios = require('axios');
const methodOverride = require('method-override');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayout);
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

require('./config/config');

app.use(require('./middleware/romanAuth').auth);

app.use('/', require('./routes/pages'));
app.use('/profile', require('./routes/profile'));
app.use('/tweet', require('./controller/tweetController'));
app.use('/note', require('./controller/noteController'));

app.post('/signup', async (req, res) => {
	const [ newUser, created ] = await db.user.findOrCreate({ where: { email: req.body.email } });
	if (!created) {
		console.log('user already exists');
		res.render('users/login.ejs', { error: 'Looks like you already have an account! Try logging in :)' });
	} else {
		const hashedPassword = bcrypt.hashSync(req.body.password, 10);
		newUser.password = hashedPassword;
		newUser.firstName = req.body.firstName;
		newUser.lastName = req.body.lastName;
		await newUser.save();

		const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET);
		const encryptedUserIdString = encryptedUserId.toString();
		res.cookie('userId', encryptedUserIdString);
		res.redirect('/tweets');
	}
});

app.post('/login', async (req, res) => {
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
		res.redirect('/tweets');
	}
});

app.get('/tweets', async (req, res) => {
	console.log('this is user' + res.locals.user.id);
	if (req.cookies.userId) {
		const bearerToken = process.env.BEARER_TOKEN;
		const accounts = [ `nexta_tv`, `ukraine`, `zelenskyyUa`, `walterlekh` ];
		const options = {
			headers: {
				Authorization: `Bearer ${bearerToken}`
			}
		};

		try {
			const params = {};
			const pedingPromises = accounts.map((account) =>
				axios.get(
					`https://api.twitter.com/2/tweets/search/recent?query=from:${account}&tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=created_at`,
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

			const user = await db.user.findAll({
				where: {
					id: res.locals.user.id
				},
				include: db.tweet
			});

			let arrtweets;
			user.forEach((element) => {
				const allTweets = element.tweets;
				arrtweets = allTweets.map((tw) => {
					const spacesout = tw.dataValues.tweetId;
					return parseInt(spacesout);
				});
			});
			res.render('newsfeed.ejs', { tIds: arrtweets, dataAll: tweets });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/users/login');
	}
});

app.get('*', (req, res) => {
	res.render('404.ejs');
});

app.listen(PORT, () => {
	console.log('It is live on port 8000 ??????');
});
