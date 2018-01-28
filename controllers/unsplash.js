const fs = require('fs');
const axios = require('axios');


exports.fetchPhoto = async ( query ) => {
	const url = 'https://api.unsplash.com/search/photos/';
	const access = `&client_id=${process.env.UNSPLASH_APP_ID}`;

	const images = await axios.get( `${url}?query=${query}${access}`	)
		.then( res => {
			let arr = [];
			res.data.results.forEach( ( r, i ) => {
				//arr.push(r.urls.regular);
				axios.get( r.urls.regular, { responseType: 'arraybuffer' } )
					.then( res => {
						fs.writeFileSync( `./image${i}.jpeg`, res.data );
					})
					.catch( err => {
						console.log(err);
					});
			});
			return arr;
		})
		.catch( err => {
			console.log(err);
		});
}
