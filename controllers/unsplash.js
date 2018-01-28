const fs = require('fs');
const axios = require('axios');

exports.fetchPhoto = async ( query, call ) => {
	// Set up request URL (API + Auth)
	const url 		= 'https://api.unsplash.com/photos/random',
				format 	= 'landscape',
				count 	= 1,
				params 	= `&orientation=${format}&count=${count}`,
				access 	= `&client_id=${process.env.UNSPLASH_APP_ID}`;

	const images = await axios
		.get( `${url}?query=${query}${params}${access}` )
		.then( res => {
			// Loop over results & write them to disk
			res.data.forEach( ( r, i ) => {
				axios
					.get( r.urls.regular, { responseType: 'arraybuffer' } )
					.then( res => { fs.writeFileSync( `./assets/image${i}.jpeg`, res.data, setTimeout( call, 100 ) ) })
					.catch( err => { console.log(err) });
			});
		})
		.catch( err => { console.log(err)	});
		return console.log('Image(s) have been saved...');
}
