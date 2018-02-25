const fs = require('fs');
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/Amatic-Bold.ttf', { family: 'amatic' });

let canvas = createCanvas(1080, 720);
let ctx = canvas.getContext('2d');

function setupCanvas( data, quote ) {
	
	let img = new Image();
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

	const alignBtm = (canvas.height - textBoxHeight) - 50;
	const alignMid = (canvas.height - textBoxHeight) / 2;
	const alignTop = 50;

	const yoff = alignBtm;

	// Gradients seems to be supper buggy in node-canvas, so hacking a darkened 
	// area using a box-shadow on a box that is positioned at the bottom of canvas
	ctx.shadowBlur = 100;
	ctx.shadowColor = 'rgba(0,0,0,.5)';
	ctx.shadowOffsetY = `-${textBoxHeight}`;
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.fillRect( -50, canvas.height, canvas.width + 50, textBoxHeight + 100 );
	ctx.shadowColor = 'transparent';

	// Render the text
	for (let i = 0; i < wrappedText.length; i++) {
		ctx.fillStyle = '#fff';
		ctx.shadowOffsetY = 0;
		ctx.shadowColor = 'rgba(0,0,0,.5)';
		ctx.shadowBlur = 10;
		ctx.fillText(	wrappedText[i], 100, yoff + (lineHeight*(i+1)) );
	}

	let buf = canvas.toBuffer();
	console.log('Saving image to FS');
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

exports.addQuote = async ( data, quote ) => {
	let arr = await setupCanvas( data, quote );
	let [ textBoxHeight, wrappedText, lineHeight, txt, fontSize ] = arr;
	drawText( textBoxHeight, wrappedText, lineHeight, txt, fontSize );
} 