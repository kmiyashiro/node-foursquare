var sys = require('sys'),
	express = require('express');

var OAuth2 = require('./oauth2').OAuth2;

var CLIENT_ID = "YIFDUZIWSP1TQL51DFDC2K3FMWHOSV14RKRSXOYZX50A0KHU";
var REDIRECT_URI = "http://distancebodza.com:30000/callback";

var oa = new OAuth2(CLIENT_ID,
				   "BCTEDAVRJK0TXQXLQF3UCB5QCVDMPUCHTJFLHZI2LUXWA2ZW",
					"https://foursquare.com",
					"/oauth2/authorize",
					"/oauth2/access_token");


var app = express.createServer();


function getBadges(access_token) {
	
	var USER_ID = "self",
		url = "https://api.foursquare.com/v2/users/" + USER_ID + "/badges"

	oa.get(url, access_token, function () {	
		console.log(arguments);
	});
}

app.get('/login', function(req, res) {

	var loc = "https://foursquare.com/oauth2/authenticate?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + REDIRECT_URI;
	res.writeHead(303, { 'location': loc });
	res.end();
});

app.get('/callback', function (req, res) {
	
	var code = req.query.code;
	var params = {
		grant_type: "authorization_code",
		redirect_uri: REDIRECT_URI,
	};
	oa.getOAuthAccessToken(code, params, function (status, access_token, refresh_token) {
		console.log(arguments);
		if (access_token !== undefined) {
			getBadges(access_token);
		} else {
			console.log("access_token is undefined.")
		}
	});
});

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(30000);