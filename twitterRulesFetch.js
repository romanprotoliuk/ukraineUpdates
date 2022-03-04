const http = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const needle = require('needle');
const config = require('dotenv').config();
const TOKEN = process.env.BEARER_TOKEN;
const PORT = process.env.PORT || 3030;

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, './', 'client', 'index.html'));
});

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamULR = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';

// const rules = [
// 	{
// 		value: 'dog has:images -is:retweet',
// 		tag: 'dog pictures'
// 	},
// 	{
// 		value: 'cat has:images -grumpy',
// 		tag: 'cat pictures'
// 		// 'from': 'twitterdev' OR from:twitterapi -from:twitter
// 		// lang: uk, en
// 	}
// ];

const rules = [ { value: 'from:romanprotoliuk' } ];

// need three seperate functionssda

// 1 to get rules
// Get stream rules
const getRules = async () => {
	const response = await needle('get', rulesURL, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
		}
	});

	// shows rules
	console.log(response.body);
	return response.body;
};

// 2 to set rules
// Set stream rules
const setRules = async () => {
	const data = {
		add: rules
	};
	const response = await needle('post', rulesURL, data, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${TOKEN}`
		}
	});

	return response.body;
};

// 3 delete rules
// Delete stream rules
const deleteRules = async (rules) => {
	if (!Array.isArray(rules.data)) {
		return null;
	}

	const ids = rules.data.map((rule) => rule.id);

	const data = {
		delete: {
			ids: ids
		}
	};
	const response = await needle('post', rulesURL, data, {
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${TOKEN}`
		}
	});

	return response.body;
};

const streamTweets = (socket) => {
	const stream = needle.get(streamULR, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
		}
	});

	stream.on('data', (data) => {
		try {
			const json = JSON.parse(data);
			console.log(json);
			socket.emit('tweet', json);
		} catch (error) {}
	});
};

io.on('connection', async () => {
	console.log('client connected...');
	let currentRules;

	try {
		// GET all stream rules
		currentRules = await getRules();

		// DELETE all stream rules
		await deleteRules(currentRules);

		// SET rules based on array above
		await setRules();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
	streamTweets(io);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
