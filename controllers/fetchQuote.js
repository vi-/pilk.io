const fs 				= require('fs');
const h 				= require('../helpers');
const filepath 	= './assets/quotes.txt';

let tidy_quotes = [];

exports.processQuote = async () => {
	if ( tidy_quotes.length === 0 ) {
		console.log('Quotes array is empty, reloading the txt file...');
		await fetchFromList();
	}
	const number = h.randomBetween( 0, tidy_quotes.length );
	const quote = tidy_quotes.splice( number, 1 );
	console.log('\n__________ \n');
	console.log( `Quotes left in this cycle: ${tidy_quotes.length} \nCurrent quote:\n${quote}` );
	return quote[0];
}

fetchFromList = () => {
	const temp = [...fs.readFileSync( filepath, 'utf8').split('\n')];
	// Remove index 0 (document title...)
	temp.splice( 0, 1 );
	tidy_quotes = ( h.without( temp, '' ) );
}

