var QUERYSTRING = require('querystring'),
	HTTPS = require('https'),
    URL = require('url');


BASESITE = "https://foursquare.com";
ACCESS_TOKEN_URL = "/oauth2/access_token";
API_URL = "https://api.foursquare.com/v2";


function getRequest(url, access_token, callback) {

	var parsedUrl = URL.parse(url, true ),
		request, result = "";

	if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
		parsedUrl.port= 443;
	}

	if( parsedUrl.query === undefined) {
		parsedUrl.query= {};
	}

	if (access_token != null) {
		parsedUrl.query["oauth_token"]= access_token;
	}

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

function extractData(status, result, field, success_handler, error_handler) {

	var json;

	if (status !== undefined && result !== undefined) {

		json = JSON.parse(result);

		// 200
		if (json.meta.code === 200) {
			if (json.response !== undefined && json.response[field] !== undefined) {

				if (success_handler !== undefined) {
					success_handler(json.response[field]);
				}
			}
		}

		// 400
		if (json.meta.code === 400) {
			if (error_handler !== undefined) {
				error_handler(json.meta);
			}
		}
	}
}


exports.getAccessToken = function (params, successHandler) {

	// adding extra params
	params["grant_type"] = "authorization_code";

	var url = BASESITE + ACCESS_TOKEN_URL + "?" + QUERYSTRING.stringify(params);


	var parsedUrl = URL.parse(url, true ),
		request, result = "";

	if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
		parsedUrl.port= 443;
	}

	if( parsedUrl.query === undefined) {
		parsedUrl.query= {};
	}

	request = HTTPS.request({
		host: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.pathname + "?" + QUERYSTRING.stringify(parsedUrl.query),
		method: "POST",
		headers: {
			'Content-Length': 0
		}
	}, function(res) {
		res.on('data', function(chunk) {
			result+= chunk;
		});

		res.on("end", function () {

			var json;

			if (successHandler !== undefined && result !== undefined) {

				json = JSON.parse(result);
				successHandler(json.access_token);
			}
		});
	});

	request.end();
};


exports.getUserBadges = function (user_id, access_token, success_handler, error_handler) {

	user_id = user_id || "self";

	var url = API_URL + "/users/" + user_id + "/badges";

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "badges", success_handler, error_handler);
	});
};

/**
 * Returns a list of tips near the area specified.
 *
 * http://developer.foursquare.com/docs/tips/search.html
 */
exports.searchTips = function (query, access_token, success_handler, error_handler) {

	var url = API_URL + "/tips/search";

	url += "?" + QUERYSTRING.stringify(query);

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "tips", success_handler, error_handler);
	});

};


exports.getRecentCheckins = function (query, access_token, success_handler, error_handler) {

	var url = API_URL + "/checkins/recent";

	url += "?" + QUERYSTRING.stringify(query);

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "recent", success_handler, error_handler);
	});

};

exports.searchVenues = function (query, access_token, success_handler, error_handler) {

	var url = API_URL + "/venues/search";

	url += "?" + QUERYSTRING.stringify(query);

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "groups", success_handler, error_handler);
	});
};

exports.searchUsers = function (query, access_token, success_handler, error_handler) {

	var url = API_URL + "/users/search";

	url += "?" + QUERYSTRING.stringify(query);

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "results", success_handler, error_handler);
	});
};


exports.getSettings = function (access_token, success_handler, error_handler) {

	var url = API_URL + "/settings/all";

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "settings", success_handler, error_handler);
	});
};

exports.getPhoto = function (photo_id, access_token, success_handler, error_handler) {

	var url = API_URL + "/photos/" + photo_id;

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "photo", success_handler, error_handler);
	});
};

exports.getTip = function (tip_id, access_token, success_handler, error_handler) {

	var url = API_URL + "/tips/" + tip_id;

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "tip", success_handler, error_handler);
	});
};

exports.getCheckin = function (checkin_id, access_token, success_handler, error_handler) {

	var url = API_URL + "/checkins/" + checkin_id;

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "checkin", success_handler, error_handler);
	});
};


exports.getVenue = function (venue_id, access_token, success_handler, error_handler) {

	var url = API_URL + "/venues/" + venue_id;

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "venue", success_handler, error_handler);
	});
};

exports.getVenueAspect = function (venue_id, access_token, success_handler, error_handler, aspect, params) {

	var url = API_URL + "/venues/" + venue_id + '/' + aspect;

    url += "?" + QUERYSTRING.stringify(params || {});
	getRequest(url, access_token, function (status, result) {
		extractData(status, result, aspect, success_handler, error_handler);
	});
};

exports.getUser = function (user_id, access_token, success_handler, error_handler) {

	var url = API_URL + "/users/" + user_id;

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "user", success_handler, error_handler);
	});
};

exports.getUserCheckins = function (user_id, access_token, success_handler, error_handler, params) {

	var url = API_URL + "/users/" + user_id + "/checkins";

	var optional = QUERYSTRING.stringify(params || {});

	if (optional !== "") {
		url += "?" + optional;
	}

	getRequest(url, access_token, function (status, result) {
		extractData(status, result, "checkins", success_handler, error_handler);
	});
};