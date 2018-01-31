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

// Method to search tweets for text
exports.searchTweets = async ( req, res, next ) => {
	// User can make requests like http://rooturl.com/?q=Cool&count=5
	// this will send request to fetch 5 tweets with word 'Cool' in them
	const options = {
		q 		: req.query.q || '"Dogs"',
		count : req.query.count || 10,
		lang 	: 'en',
		tweet_mode : 'extended'
	}
	const tweets = await bot.get( 'search/tweets', options,
		(err, data, res) => {
			if (err) {
				console.log(`Something went wrong with Search request... \n${err}`);
			} else {
				if (!data.statuses.length) console.log( `Could noty find any tweets that contain ${options.q}` );
				return data;
			}
		}
	);
	res.render('index', { title: 'Booom!', tweets });
	
}

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

// Scheduled Tweets...

exports.postTweet = ( ) => {
	const tweet = q.processQuote();
	console.log(`${tweet}\n`);
	/*
	bot.post( 'statuses/update', { status: tweet }, ( err, data, res ) => {
		if ( err ) {
			console.log( `Could not send the tweet... \n${err}` );
		} else {
			console.log( `Just tweeted: \n${data.text}` );
		}
	});
	*/
}