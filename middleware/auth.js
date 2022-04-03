'use strict';
/**
 * @desc     Auth middleware
 */
module.exports = async (req, res, next) => {
	if (req.cookies.userId) next();
	else res.redirect('/login');
};
