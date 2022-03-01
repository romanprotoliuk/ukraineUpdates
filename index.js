const express = require('express');

// create an instance of express
const app = express();

// HOME route
// GET REQUEST => the client has sent a (R)ead request for files or data
// req = request object, res = response object
app.get('/', (req, res) => {
	// send 'Hello, world' back to the client that made the request
	res.send('Hello, World!');
});

// assign a port for our server to listen for incoming requests
app.listen(8000, () => {
	console.log("You're listening to the smooth sounds of port 8000");
});
