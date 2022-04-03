const router = require('express').Router();
const profileController = require('../controller/profile');
const Auth = require('../middleware/auth');

router.get('/journal', Auth, profileController.getAllJournal);
router.get('/tweets', Auth, profileController.getAllTweets);

module.exports = router;
