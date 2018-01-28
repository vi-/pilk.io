const express 		= require('express');
const router			= express.Router();
const twitterBot 	= require('../controllers/twitterBot');

router.get( '/', twitterBot.searchTweets );

module.exports = router;