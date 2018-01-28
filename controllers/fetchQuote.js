const fs 				= require('fs');
const h 				= require('../helpers');
const filepath 	= './assets/quotes.txt';
const quotes 		= [...fs.readFileSync( filepath, 'utf8').split('\n')];

exports.processQuote = () => {
	const tidy_quotes = ( h.without( quotes, '' ) );
	return tidy_quotes[ h.randomBetween( 1, tidy_quotes.length ) ];
}

