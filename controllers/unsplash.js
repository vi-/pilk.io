const fs = require('fs');
const axios = require('axios');

exports.fetchPhoto = async ( query, res) => {
	// Set up request URL (API + Auth)
	const url 		= 'https://api.unsplash.com/photos/random',
				format 	= 'landscape',
				count 	= 1,
				params 	= `&orientation=${format}&count=${count}`,
				access 	= `&client_id=${process.env.UNSPLASH_APP_ID}`;

		const images = await axios
			.get( `${url}?query=${query}${params}${access}` )
			.then( res => res.data )
			.catch( err => { console.log(`Couldn't return list of images... ${err}`) });

		const img = await axios
			.get( images[0].urls.regular, { responseType: 'arraybuffer' } )
			.then( res => res.data )
			.catch( err => { console.log(`Could not save image to buffer... ${err}`) });

		console.log('Returning img ArrayBuffer...');
		return img;
}
