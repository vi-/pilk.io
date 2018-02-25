// load them enviromantal vars up...
require('dotenv').config({ path: 'variables.env' });

const express 		= require('express');
const bodyParser 	= require('body-parser');
const helpers 		= require('./helpers');
const twitterBot 	= require('./controllers/twitterBot');
const fetchQuote 	= require('./controllers/fetchQuote');
const unsplash 		= require('./controllers/unsplash');
const cnv 				= require('./controllers/canvasOperations');

const app = express();

// Make my helper functions available
app.use( (req, res, next) => {
	res.locals.h = helpers;
	next();
});

// The Karl_Pilkingbot 
async function produceWisdom() {
	// Pick a quote
	const quote = await fetchQuote.processQuote();
	// Fetch image from Unsplash API tagged as something
	const image = await unsplash.fetchPhoto( 'nature' );
	// Overlay quote over image
	const result = await cnv.addQuote( image, quote );
	// Tweet the resulting image...
	twitterBot.uploadMedia('Some Karl wisdom...', result );
}

produceWisdom();
// Do every 12 hrs
setInterval( produceWisdom, 1000*60*60*12 );

// Set port and start the app.
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});