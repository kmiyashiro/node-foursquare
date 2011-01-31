var sys = require('sys'),
	express = require('express');

var FOURSQ = require('./foursquare'),
	KEYS = require('./key');


var CLIENT_ID = KEYS.CLIENT_ID;
var CLIENT_SECRET = KEYS.CLIENT_SECRET;
var REDIRECT_URI = "http://distancebodza.com:30000/callback";

var app = express.createServer();

app.get('/login', function(req, res) {

	var loc = "https://foursquare.com/oauth2/authenticate?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + REDIRECT_URI;
	res.writeHead(303, { 'location': loc });
	res.end();
});

app.get('/callback', function (req, res) {

	var code = req.query.code;

	FOURSQ.getAccessToken({
		code: code,
		redirect_uri: REDIRECT_URI,
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET
	}, function (access_token) {

		if (access_token !== undefined) {

			console.log("Access token " + access_token);

			FOURSQ.getUser("self", access_token, function (user) {
				res.send(JSON.stringify(user));
			}, function (error) {
				res.send(JSON.stringify(error));
			});

			// FOURSQ.getVenue(5104, access_token, function (venue) {
			// 	res.send(JSON.stringify(venue));
			// }, function (error) {
			// 	res.send(JSON.stringify(error));
			// });

			// FOURSQ.getCheckin("IHR8THISVNU", access_token, function (checkin) {
			// 	res.send(JSON.stringify(checkin));
			// }, function (error) {
			// 	res.send(JSON.stringify(error));
			// });

			// FOURSQ.getTip("4b5e662a70c603bba7d790b4", access_token, function (data) {
			// 	res.send(JSON.stringify(data));
			// }, function (error) {
			// 	res.send(JSON.stringify(error));
			// });

		} else {
			console.log("access_token is undefined.");
		}

	});
});

app.get('/', function(req, res){
    res.send('Hello Foursquare');
});


app.listen(30000);