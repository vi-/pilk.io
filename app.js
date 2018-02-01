// load them enviromantal vars up...
require('dotenv').config({ path: 'variables.env' });

const Twit 				= require('twit');
const request 		= require('request');
const fs 					= require('fs');
const express 		= require('express');
const bodyParser 	= require('body-parser');
const path 				= require('path');
const helpers 		= require('./helpers');
const routes			= require('./routes/index');
const twitterBot 	= require('./controllers/twitterBot');
const fetchQuote 	= require('./controllers/fetchQuote');
const unsplash 		= require('./controllers/unsplash');
const placeText 	= require('./controllers/placeText');
const cnv 				= require('./controllers/canvasOperations');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serves up static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Make my helper functions available
app.use( (req, res, next) => {
	res.locals.h = helpers;
	next();
});

// Handle Routes
app.use('/', routes);

// Testing scheduled tweets
// setInterval( twitterBot.postTweet, 1000*10 );

// Experimenting with node-canvas



//Fetch photo, draw text
// async function fetchAndProcessPhoto() {
// 	await unsplash.fetchPhoto( 'nature' );
// 	setTimeout( cnv.addQuote, 10000);
// }

// fetchAndProcessPhoto();

async function makeImg() {
	// get photo
	let file = await unsplash.fetchPhoto( 'nature' );
	//setTimeout( function(){ tweetImg(file) }, 1000*10 );
}

function tweetImg( file ) {
	twitterBot.uploadMedia('Some Karl wisdom...', file );
}
	

makeImg();
setInterval( makeImg, 1000*5 );



// Set port and start the app.
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});





