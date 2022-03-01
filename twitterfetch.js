const axios = require('axios');
require('dotenv').config();

const bearerToken = process.env.BEARER_TOKEN;

const accounts = [ `nexta_tv`, `ukraine` ];
const options = {
	headers: {
		Authorization: `Bearer ${bearerToken}`
	}
};

const getTweets = async () => {
	try {
		const pedingPromises = accounts.map((account) =>
			axios.get(`https://api.twitter.com/2/tweets/search/recent?query=from:${account}`, options)
		);
		const responses = await Promise.all(pedingPromises);
		for (let i = 0; i < responses.length; i++) {
			console.log(responses[i].data);
		}
	} catch (err) {
		console.log(err);
	}
};
getTweets();
