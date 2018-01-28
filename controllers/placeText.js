const fs 		= require('fs');
const Jimp 	= require('jimp');
const q 		= require('./fetchQuote');

exports.writeText = () => {
	Jimp.read("./assets/image0.jpeg", function (err, image) {
			if (err) console.log(`Failed to read image file. ${err}`);

			Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {
					image.print(font, 50, 50, q.processQuote(), 980)
						.write("./assets/image-w-txt.jpeg");
			});
			console.log( 'Text added...' );

	});
}