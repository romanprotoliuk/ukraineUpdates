const cryptojs = require('crypto-js');
const db = require('../models');

module.exports.auth = async (req, res, next) => {
	if (req.cookies.userId) {
		const decryptedId = cryptojs.AES.decrypt(req.cookies.userId, process.env.SECRET);
		const decryptedIdString = decryptedId.toString(cryptojs.enc.Utf8);
		const user = await db.user.findByPk(decryptedIdString);
		res.locals.user = user;
	} else res.locals.user = null;
	next();
};
