var QueryString = require('querystring'),
	HTTPS = require('https'),
  URL = require('url'),
  defaultConfig = {
    "accessTokenUrl" : "https://foursquare.com/oauth2/access_token",
    "apiUrl" : "https://api.foursquare.com/v2"
  };

var Foursquare = function(config) {
  config = config || defaultConfig;

  var emptyCallback = function() { };

  if(!config.accessTokenUrl || !config.apiUrl) {
    throw new TypeError("Supplied configuration is invalid.");
  }

  function retrieve(url, callback) {
    callback = callback || emptyCallback;

    var parsedUrl = URL.parse(url, true), request, result = "";

    if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
      parsedUrl.port = 443;
    }

    if (parsedUrl.query === undefined) {
      parsedUrl.query = {};
    }

    request = HTTPS.request({
      "host" : parsedUrl.hostname,
      "port" : parsedUrl.port,
      "path" : parsedUrl.pathname + "?" + QueryString.stringify(parsedUrl.query),
      "method" : "POST",
      "headers" : {
        "Content-Length": 0
      }
    }, function(res) {
      res.on("data", function(chunk) {
        result += chunk;
      });
      res.on("error", function(error) {
        callback(error);
      });
      res.on("end", function () {
        callback(null, res.statusCode, result);
      });
    });

    request.end();
  }

  function invokeAPI(url, accessToken, callback) {

    var parsedUrl = URL.parse(url, true);

    callback = callback || emptyCallback;

    if(accessToken != null) {
      parsedUrl.query["oauth_token"] = accessToken;
    }

    retrieve(url.format(parsedUrl), 
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          callback(null, status, result);
        }
      });
  }

  function extractData(status, result, field, callback) {
    var json;
    callback = callback || emptyCallback;

    if (status !== undefined && result !== undefined) {
      try {
        json = JSON.parse(result);
      }
      catch(e) {
        callback(e);
        return;
      }

      // 200
      if (json.meta.code === 200) {
        if (json.response !== undefined && json.response[field] !== undefined) {
          callback(null, json.response[field]);
        }
        else {
          callback(null, {});
        }
      }

      // 400
      if (json.meta.code === 400) {
        callback(new Error("Remote site unreachable."));
      }
      else {
        callback(new Error("Code " + json.meta.code + " received."));
      }
    }
  }

  exports.getAccessToken = function (params, callback) {
    params = params || [];
    params["grant_type"] = "authorization_code";

    retrieve(config.accessTokenUrl + "?" + QueryString.stringify(params),
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          try {
            var obj = JSON.parse(result);
            callback(null, obj.access_token);
          }
          catch(e) {
            callback(e);
          }
        }
      });
  };

  exports.getUserBadges = function (user_id, accessToken, callback) {

    user_id = user_id || "self";

    var url = config.apiUrl + "/users/" + user_id + "/badges";

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "badges", callback);
    });
  };

  /**
   * Returns a list of tips near the area specified.
   *
   * http://developer.foursquare.com/docs/tips/search.html
   */
  exports.searchTips = function (query, accessToken, callback) {

    var url = config.apiUrl + "/tips/search";
    url += "?" + QueryString.stringify(query);

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "tips", callback);
    });

  };


  exports.getRecentCheckins = function (query, accessToken, callback) {

    var url = config.apiUrl + "/checkins/recent";
    url += "?" + QueryString.stringify(query);

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "recent", callback);
    });

  };

  exports.searchVenues = function (query, accessToken, callback) {

    var url = config.apiUrl + "/venues/search";
    url += "?" + QueryString.stringify(query);

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "groups", callback);
    });
  };

  exports.searchUsers = function (query, accessToken, callback) {

    var url = config.apiUrl + "/users/search";
    url += "?" + QueryString.stringify(query);

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "results", callback);
    });
  };


  exports.getSettings = function (accessToken, callback) {

    var url = config.apiUrl + "/settings/all";

    invokeAPI(url, accessToken, function (status, result) {
      extractData(status, result, "settings", callback);
    });
  };

  exports.getPhoto = function (photo_id, accessToken, callback) {

    var url = config.apiUrl + "/photos/" + photo_id;

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "photo", callback);
    });
  };

  exports.getTip = function (tip_id, accessToken, callback) {

    var url = config.apiUrl + "/tips/" + tip_id;

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "tip", callback);
    });
  };

  exports.getCheckin = function (checkin_id, accessToken, callback) {

    var url = config.apiUrl + "/checkins/" + checkin_id;

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "checkin", callback);
    });
  };


  exports.getVenue = function (venue_id, accessToken, callback) {

    var url = config.apiUrl + "/venues/" + venue_id;

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "venue", callback);
    });
  };

  exports.getVenueAspect = function (venue_id, accessToken, aspect, params, callback) {

    var url = config.apiUrl + "/venues/" + venue_id + '/' + aspect;
    url += "?" + QueryString.stringify(params || {});

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, aspect, callback);
    });
  };

  exports.getUser = function (user_id, accessToken, callback) {

    var url = config.apiUrl + "/users/" + user_id;

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "user", callback);
    });
  };

  exports.getUserCheckins = function (user_id, accessToken, params, callback) {

    var url = config.apiUrl + "/users/" + user_id + "/checkins",
      optional = QueryString.stringify(params || {});

    if (optional !== "") {
      url += "?" + optional;
    }

    invokeAPI(url, accessToken, function (error, status, result) {
      extractData(status, result, "checkins", callback);
    });
  }
};

exports.Foursquare = Foursquare;