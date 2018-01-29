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

// Canvas stuff
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/HomemadeApple.ttf', { family: 'apple' });

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

function setupCanvas() {
	let canvas = createCanvas(1080, 720);
	let ctx = canvas.getContext('2d');
	let img = new Image();
	img.src = './assets/image0.jpeg';
	[ canvas.width, canvas.height ] =  [ img.width, img.height ];
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	ctx.font = '900 42px apple';
	ctx.fillStyle = '#fff';
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000';
	
	const wrappedText = getLines( 
		ctx, 
		fetchQuote.processQuote(), 
		canvas.width - 100 
	);

	for (let i = 0; i < wrappedText.length; i++) {
		ctx.fillStyle = '#fff';
		ctx.shadowColor = '#000';
		ctx.shadowBlur = 5;
		ctx.fillText(	wrappedText[i], 50, 100 + (60*(i+1)) );
	}

	let buf = canvas.toBuffer();
	fs.writeFileSync('./canvas.jpg', buf);
	console.log(`${canvas.width}, ${canvas.height}`);
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

setupCanvas();

// Fetch photo, draw text
//unsplash.fetchPhoto( 'nature', placeText.writeText );

// Set port and start the app.
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});





