const Twit 				= require('twit');
const request 		= require('request');
const fs 					= require('fs');
const q 					= require('./fetchQuote');

const bot = new Twit({
	consumer_key: 				process.env.PILKIOBOT_CONSUMER_KEY,
	consumer_secret: 			process.env.PILKIOBOT_CONSUMER_SECRET,
	access_token: 				process.env.PILKIOBOT_ACCESS_TOKEN,
	access_token_secret: 	process.env.PILKIOBOT_ACCESS_TOKEN_SECRET,
	timeout_ms: 60*1000
});

/*
# NOTE: Twitter has 280 Char limit...
*/

exports.uploadMedia = ( description, filePath ) => {
	bot.postMediaChunked( { file_path: './assets/pilkers.jpg' }, function( err, data, response ) {
		if (err) {
			console.log(`Could not uplad media... ${err}`);
		} else {
			console.log(data);
			const params = {
				status: description,
				media_ids: data.media_id_string
			};
			postStatus(params);
		}
	});
}

function postStatus(params) {
	bot.post('statuses/update', params, (err, data, response) => {
		if (err) {
			console.log(`Could not update status... ${err}`);
		} else {
			console.log('Pilk.io tweeted...');
		}
	})
}