const db = require('./models');

// const addUserTweet = async () => {
// 	const user = await db.user.findOne();

// 	console.log(user);
// 	const [ tweet ] = await db.tweet.findOrCreate({
// 		where: {
// 			tweetId: '2',
// 			text: 'somethign special',
// 			author_id: '123'
// 		}
// 	});
// 	// res.locals.user
// 	await user.addTweet(tweet);
// 	const foundTweets = await user.getTweets();
// 	console.log(foundTweets);
// };

// addUserTweet();

const getAllUserTweets = async () => {
	const user = await db.user.findAll({
		where: {
			id: 5
		},
		include: db.tweet
	});
	const arrWithIds = [];
	user.forEach((element, i) => {
		const allTweets = element.tweets;
		allTweets.forEach((tweet, i) => {
			// arrWithIds.push(tweet.dataValues.tweetId);
			// const arr = [ tweet.dataValues.tweetId ];
			const num = 1502797789176152067;
			console.log(parseInt(tweet.dataValues.tweetId) === num);
		});
	});
};
// element.tweets[i]
getAllUserTweets();
