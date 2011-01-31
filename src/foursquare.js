var QUERYSTRING = require('querystring'),
	HTTPS = require('https'),
    URL = require('url');


function get(method, url, headers, access_token, callback) {

  var parsedUrl = URL.parse(url, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) parsedUrl.port= 443;

	var request, result = "";

  var realHeaders= {};
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }

  //TODO: Content length should be dynamic when dealing with POST methods....
  realHeaders['Content-Length']= 0;
  if( access_token ) {
    if( ! parsedUrl.query ) parsedUrl.query= {};
    parsedUrl.query["oauth_token"]= access_token;
  }

	console.log(parsedUrl.pathname + "?" + QUERYSTRING.stringify(parsedUrl.query));
  request = HTTPS.request({
	  host: parsedUrl.hostname,
	  port: parsedUrl.port,
	  path: parsedUrl.pathname + "?" + QUERYSTRING.stringify(parsedUrl.query),
	  method: method,
		headers: realHeaders
	}, function(res) {
		res.on('data', function(chunk) {
			result+= chunk;
		});

    res.on("end", function () {
      if( res.statusCode != 200 ) {
        callback({ statusCode: res.statusCode, data: result });
      } else {
        callback(null, result, res);
      }
    });
  });

  request.end();
}




exports.getUser = function (user_id, access_token, successHandler) {
	
	var url = "https://api.foursquare.com/v2/users/" + user_id;
	
	get(url, access_token, function () {	
		console.log(arguments);
	});
	
};