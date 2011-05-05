/**
 * A CommonJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @exports Foursquare
 * @version 0.1
 * @author Clint Andrew Hall
 */
var qs = require('querystring'),
  sys = require("sys"),
  https = require('https'),
  urlParser = require('url'),
  log4js = require("log4js")(),
  logger = log4js.getLogger("node-foursquare"),
  defaultConfig = {
    "accessTokenUrl" : "https://foursquare.com/oauth2/access_token",
    "authenticateUrl" : "https://foursquare.com/oauth2/authenticate",
    "apiUrl" : "https://api.foursquare.com/v2"
  };

// This isn't right... throws errors in some cases. TODO: investigate proper form.
//log4js.configure("./../log4js.json");

/**
 *
 * @param config
 * @namespace
 */
var Foursquare = function(config) {
  config = config || defaultConfig;
  
  var emptyCallback = function() { }, api = {
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Users" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Venues" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Checkins" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Tips" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Photos" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Settings" : {},
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Specials" : {}
  };

  if(!config.accessTokenUrl || !config.apiUrl) {
    throw new TypeError("Supplied configuration is invalid.");
  }

  function retrieve(url, callback) {
    callback = callback || emptyCallback;

    var parsedUrl = urlParser.parse(url, true), request, result = "";

    if(parsedUrl.protocol == "https:" && !parsedUrl.port) {
      parsedUrl.port = 443;
    }

    if(parsedUrl.query === undefined) {
      parsedUrl.query = {};
    }
    var path = parsedUrl.pathname + "?" + qs.stringify(parsedUrl.query);
    logger.debug("Requesting: " + path);
    request = https.request({
      "host" : parsedUrl.hostname,
      "port" : parsedUrl.port,
      "path" : path,
      "method" : "GET",
      "headers" : {
        "Content-Length": 0
      }
    }, function(res) {
      res.on("data", function(chunk) {
        result += chunk;
      });
      res.on("end", function() {
        callback(null, res.statusCode, result);
      });
    });
    request.on("error", function(error) {
      logger.error("Error calling remote host: " + error.message);
      callback(error);
    });

    request.end();
  }

  function invokeAPI(url, accessToken, callback) {

    callback = callback || emptyCallback;

    if(accessToken != null) {
      var parsedUrl = urlParser.parse(url, true);
      parsedUrl.query.oauth_token = accessToken;
      parsedUrl.search = "?" + qs.stringify(parsedUrl.query);
      url = urlParser.format(parsedUrl);
    }

    retrieve(url,
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

    if(status !== undefined && result !== undefined) {
      try {
        json = JSON.parse(result);
      }
      catch(e) {
        callback(e);
        return;
      }

      if(json.meta && json.meta.code === 200) {
        if(json.response !== undefined && json.response[field] !== undefined) {
          callback(null, json.response[field]);
        }
        else {
          callback(null, {});
        }
      }
      else if(json.meta) {
        logger.error("JSON Response had unexpected code: \"" + json.meta.code + ": " + json.meta.errorDetail + "\"");
        callback(new Error(json.meta.code + ": " + json.meta.errorDetail));
      }
      else {
        callback(new Error("Response had no code: " + sys.inspect(json)));
      }
    }
  }

  function callApi(path, accessToken, field, params, callback) {

    var url = config.apiUrl + path;

    if(params) {
      if((params.lat && !params.lng) || (!params.lat && params.lng)) {
        callback(new Error("parameters: if you specify a longitude or latitude, you must include BOTH."));
        return;
      }

      if(params.lat && params.lng) {
        params.ll = params.lat + "," + params.lng;
        delete params.lat;
        delete params.lng;
      }

      url += "?" + qs.stringify(params);
      logger.trace("URL: " + url);
    }

    invokeAPI(url, accessToken, function(error, status, result) {
      extractData(status, result, field, callback);
    });
  }

  /**
   * Exchange a user authorization code for an access token.
   * @param {Object} params A collection of parameters for the Access Token request.
   * @param {String} params.code The code provided by Foursquare as the result of the user redirect.
   * @param {String} params.redirect_uri The URL to redirect to after the code is exchanged for a token.
   * @param {String} params.client_id The Client ID provided by Foursquare.
   * @param {String} params.client_secret The Client Secret provided by Foursquare.
   * @param {String} [params.grant_type="authorization_code"] The type of authorization to request.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getAccessToken
   * @function
   * @memberOf Foursquare
   * @see https://developer.foursquare.com/docs/oauth.html
   */
  api.getAccessToken = function(params, callback) {
    params = params || {};
    params.grant_type = "authorization_code";

    retrieve(config.accessTokenUrl + "?" + qs.stringify(params),
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          try {
            callback(null, JSON.parse(result).access_token);
          }
          catch(e) {
            callback(e);
          }
        }
      });
  };

  /**
   * Build and return an appropriate Authorization URL where the user can grant permission to the application.
   * @param {String} clientId The Client ID provided by Foursquare
   * @param {String} redirectUrl The URL to redirect to after authorization is granted.
   * @name getAuthClientRedirectUrl
   * @function
   * @memberOf Foursquare
   *
   */
  api.getAuthClientRedirectUrl = function(clientId, redirectUrl) {
    return config.authenticateUrl + "?client_id=" + clientId + "&response_type=code&redirect_uri=" + redirectUrl;
  };

  /**
   * Find Foursquare Users.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/search.html
   */
  api.Users.search = function(params, accessToken, callback) {
    callApi("/users/search", accessToken, "results", params || {}, callback);
  };

  /**
   * Retrieve a Foursquare User.
   * @param {String} userId The id of the User to retreive.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getUser
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/users.html
   */
  api.Users.getUser = function(userId, accessToken, callback) {
    if(!userId) {
      callback(new Error("getUser: userId is required."));
      return;
    }
    callApi("/users/" + userId, accessToken, "user", null, callback);
  };

  /**
   *
   * @param {String} [userId="self"] The id of the User to retreive.
   * @param {String} aspect The aspect to retrieve. Refer to Foursquare documentation for details on currently
   * supported aspects.
   * @param {String} [field=aspect] The field to return from the JSON response. Refer to the documentation for the
   * specific aspect for details.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getUserAspect
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/index_docs.html
   */
  api.Users.getUserAspect = function(userId, aspect, field, accessToken, params, callback) {
    if(!aspect) {
      callback(new Error("getUserAspect: aspect is required."));
      return;
    }
    field = field || aspect;
    callApi("/users/" + (userId || "self") + "/" + aspect, accessToken, field, params, callback);
  };

  /**
   * Retrieve a list of badges.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} [field="badges"] The field to return from the JSON response. Refer to the documentation for the
   * specific aspect for details.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getBadges
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/badges.html
   */
  api.Users.getBadges = function(userId, field, accessToken, callback) {
    field = field || "badges";
    api.Users.getUserAspect(userId, "badges", field, accessToken, null, callback);
  };

  /**
   * Retrieve Check-ins for a Foursquare User.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getCheckins
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/checkins.html
   */
  api.Users.getCheckins = function(userId, accessToken, params, callback) {
    api.Users.getUserAspect(userId, "checkins", null, accessToken, params, callback);
  };

  /**
   * Retrieve Friends for a Foursquare User.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getFriends
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/friends.html
   */
  api.Users.getFriends = function(userId, accessToken, params, callback) {
    api.Users.getUserAspect(userId, "friends", null, accessToken, params, callback);
  };

  /**
   * Retrieve Tips for a Foursquare User.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTips
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/tips.html
   */
  api.Users.getTips = function(userId, accessToken, params, callback) {
    api.Users.getUserAspect(userId, "tips", null, accessToken, params, callback);
  };

  /**
   * Retrieve Todos for a Foursquare User.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @name getTodos
   * @function
   * @memberOf Foursquare.Users
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/todos.html
   */
  api.Users.getTodos = function(userId, accessToken, params, callback) {
    params = params || {};
    params.sort = params.sort || "recent";
    api.Users.getUserAspect(userId, "todos", null, accessToken, params, callback);
  };

  /**
   * Retrieve Venues visited by a Foursquare User.
   * @param {String} [userId="self"] The id of the user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getVenueHistory
   * @function
   * @memberOf Foursquare.Users
   * @see https://developer.foursquare.com/docs/users/venuehistory.html
   */
  api.Users.getVenueHistory = function(userId, accessToken, params, callback) {
    api.Users.getUserAspect(userId, "venuehistory", "venues", accessToken, params, callback);
  };

  /**
   * Search Foursquare Venues.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/search.html
   */
  api.Venues.search = function(params, accessToken, callback) {
    callApi("/venues/search", accessToken, "groups", params || {}, callback);
  };

  /**
   * Return Foursquare Venues near location with the most people currently checked in. 
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/trending.html
   */
  api.Venues.getTrending = function(params, accessToken, callback) {
    callApi("/venues/trending", accessToken, "venues", params || {}, callback);
  };


  /**
   * Retrieve a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getVenue
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/venues.html
   */
  api.Venues.getVenue = function(venueId, accessToken, callback) {
    if(!venueId) {
      callback(new Error("getVenue: venueId is required."));
      return;
    }
    callApi("/venues/" + venueId, accessToken, "venue", null, callback);
  };

  /**
   *
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} aspect The aspect to retrieve. Refer to Foursquare documentation for details on currently
   * supported aspects.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getVenueAspect
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/index_docs.html
   */
  api.Venues.getVenueAspect = function(venueId, aspect, accessToken, params, callback) {
    if(!venueId) {
      callback(new Error("getVenueAspect: venueId is required."));
      return;
    }
    if(!aspect) {
      callback(new Error("getVenueAspect: aspect is required."));
      return;
    }
    callApi("/venues/" + venueId + '/' + aspect, accessToken, aspect, params || {}, callback);
  };

  /**
   * Retrieve Check-ins for Users who are at a Venue "now".
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getHereNow
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/herenow.html
   */
  api.Venues.getHereNow = function(venueId, accessToken, params, callback) {
    api.Venues.getVenueAspect(venueId, "herenow", accessToken, params, callback)
  };

  /**
   * Retrieve Tips for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTips
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/tips.html
   */
  api.Venues.getTips = function(venueId, accessToken, params, callback) {
    api.Venues.getVenueAspect(venueId, "tips", accessToken, params, callback)
  };

  /**
   * Retrieve Photos for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [group="checkin"] The type of photos to retrieve. Refer to Foursquare documentation for details
   * on currently supported groups.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getPhotos
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/photos.html
   */
  api.Venues.getPhotos = function(venueId, group, accessToken, params, callback) {
    params = params || {};
    params.group = group || "checkin";
    api.Venues.getVenueAspect(venueId, "photos", accessToken, params, callback)
  };

  /**
   * Retrieve Links for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getLinks
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/links.html
   */
  api.Venues.getLinks = function(venueId, accessToken, params, callback) {
    api.Venues.getVenueAspect(venueId, "links", accessToken, params, callback)
  };

  /**
   * Retrieve a Foursquare Check-in.
   * @param {String} checkinId The id of the check-in.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getCheckin
   * @function
   * @memberOf Foursquare.Checkins
   * @see https://developer.foursquare.com/docs/checkins/checkins.html
   */
  api.Checkins.getCheckin = function(checkinId, accessToken, params, callback) {
    if(!checkinId) {
      callback(new Error("getCheckin: checkinId is required."));
      return;
    }
    callApi("/checkins/" + checkinId, accessToken, "checkin", params || {}, callback);
  };

  /**
   * Retreive recent checkins.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getRecentCheckins
   * @function
   * @memberOf Foursquare.Checkins
   * @see https://developer.foursquare.com/docs/checkins/recent.html
   */
  api.Checkins.getRecentCheckins = function(accessToken, params, callback) {
    callApi("/checkins/recent", accessToken, "recent", params || {}, callback);
  };

  /**
   * Retrieve a Tip.
   * @param {String} tipId The id of a Tip.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTip
   * @function
   * @memberOf Foursquare.Tips
   * @see https://developer.foursquare.com/docs/tips/tips.html
   */
  api.Tips.getTip = function(tipId, accessToken, callback) {
    if(!tipId) {
      callback(new Error("getTip: tipId is required."));
      return;
    }
    callApi("/tips/" + tipId, accessToken, "tip", null, callback);
  };

  /**
   * 
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Tips
   * @see http://developer.foursquare.com/docs/tips/search.html
   */
  api.Tips.search = function(lat, lng, params, accessToken, callback) {
    params = params || {};

    if(!lat || !lng) {
      logger.error("Lat and Lng are both required parameters.");
      callback(new Error("searchTips: lat and lng are both required."));
      return;
    }

    callApi("/tips/search", accessToken, "tips", params, callback);
  };

  /**
   * Retrieve a photo from Foursquare.
   * @param {String} photoId The id of the Photo to retreive.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getPhoto
   * @function
   * @memberOf Foursquare.Photos
   * @see https://developer.foursquare.com/docs/photos/photos.html
   */
  api.Photos.getPhoto = function(photoId, accessToken, callback) {
    if(!photoId) {
      callback(new Error("getPhoto: photoId is required."));
      return;
    }
    callApi("/photos/" + photoId, accessToken, "photo", null, callback);
  };

  /**
   * Retreive Foursquare settings for the current user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getSettings
   * @function
   * @memberOf Foursquare.Settings
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  api.Settings.getSettings = function(accessToken, callback) {
    callApi("/settings/all", accessToken, "settings", null, callback);
  };

  return api;
};

exports.Foursquare = Foursquare;