var QUERYSTRING = require('querystring'),
	HTTPS = require('https'),
    URL = require('url');


function getRequest(url, access_token, callback) {

	var parsedUrl = URL.parse(url, true ),
		request, result = "";

	if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
		parsedUrl.port= 443;
	}

	if( parsedUrl.query === undefined) {
		parsedUrl.query= {};
	}
	parsedUrl.query["oauth_token"]= access_token;

	request = HTTPS.request({
		host: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.pathname + "?" + QUERYSTRING.stringify(parsedUrl.query),
		method: "GET"
	}, function(res) {
		res.on('data', function(chunk) {
			result+= chunk;
		});

		res.on("end", function () {
			callback(res.statusCode, result);
		});
	});

	request.end();
}




exports.getUser = function (user_id, access_token, successHandler) {

	var url = "https://api.foursquare.com/v2/users/" + user_id;

	getRequest(url, access_token, function (status, result) {

		var json;
		if (status !== undefined && result !== undefined) {

			json = JSON.parse(result);
			if (json !== undefined && json.response !== undefined && json.response.user !== undefined) {

				if (successHandler !== undefined) {
					successHandler(json.response.user);
				}
			}
		}
	});
};