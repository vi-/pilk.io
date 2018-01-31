const fs 					= require('fs');
const request 		= require('request');
const fetchQuote 	= require('../controllers/fetchQuote');
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/Amatic-Bold.ttf', { family: 'amatic' });

let canvas = createCanvas(1080, 720);
let ctx = canvas.getContext('2d');

function setupCanvas( data ) {
	
	let img = new Image();
	let quote = fetchQuote.processQuote();
	//img.src = './assets/image0.jpeg';
	img.src = data;

	[ canvas.width, canvas.height ] =  [ img.width, img.height ];
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	// split text into wrapping lines array
	let fontSize = 28;
	if ( quote.length >= 350 ) {
		fontSize = 28;
	} else if ( quote.length >= 250 && quote.length < 350 ) {
		fontSize = 34;
	} else if ( quote.length >= 150 && quote.length < 250 ) {
		fontSize = 46;
	} else if ( quote.length > 100 && quote.length < 150 ) {
		fontSize = 62;
	} else if ( quote.length < 100 ) {
		fontSize = 92;
	}

	let lineHeight = (fontSize > 42) ? fontSize * .95 : fontSize * 1.1;

	ctx.font = `${fontSize}px amatic`;
	
	let wrappedText = getLines( ctx, quote,	canvas.width - 200 );

	let textBoxHeight = wrappedText.length * lineHeight + 20;

	return [ textBoxHeight, wrappedText, lineHeight, quote, fontSize ];
}

function drawText(textBoxHeight, wrappedText, lineHeight, quote, fontSize) {

	console.log(`
		quote length: ${quote.length}\n
		font-size: ${fontSize}\n
		line-height: ${lineHeight}\n
		quote box height: ${textBoxHeight}`
	);

	const alignBtm = (canvas.height - textBoxHeight) - 50;
	const alignMid = (canvas.height - textBoxHeight) / 2;
	const alignTop = 50;

	const xoff = alignBtm;

	// Create gradient backdrop 1st...
	let grd = ctx.createLinearGradient( 0, xoff, 0, canvas.height );
	grd.addColorStop(0, "rgba(0,0,0,0)");
	grd.addColorStop(1, "rgba(0,0,0,.8)" );
	ctx.fillStyle = grd;
	ctx.fillRect( 0, alignBtm, canvas.width, canvas.height );

	// Render the text
	for (let i = 0; i < wrappedText.length; i++) {
		ctx.fillStyle = '#fff';
		ctx.shadowColor = 'rgba(0,0,0,.5)';
		ctx.shadowBlur = 10;
		ctx.fillText(	wrappedText[i], 100, xoff + (lineHeight*(i+1)) );
		//ctx.shadowBlur = 0;
		//ctx.strokeRect( 50, xoff, canvas.width - 100, textBoxHeight );
	}

	let buf = canvas.toBuffer();

	fs.writeFileSync(`./assets/pilkers.jpg`, buf);
	return `./assets/pilkers.jpg`;
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

exports.addQuote = async ( data ) => {
	console.log('addQuote is here...');
	// perform all neceserry operations and then export image with text
	let arr = await setupCanvas( data );
	let [ textBoxHeight, wrappedText, lineHeight, quote, fontSize ] = arr;
	drawText( textBoxHeight, wrappedText, lineHeight, quote, fontSize );
} 