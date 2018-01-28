const fs = require('fs');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Creates URL for tweet based on ID
exports.twitterUrl = ( id_str ) => `https://twitter.com/statuses/${id_str}`;

// Exclude values from an array
exports.without = ( arr, ...args ) => arr.filter( v => !args.includes(v) );

// Get random number within range
exports.randomBetween = ( min, max ) => Math.floor( Math.random() * (max - min) + min);