/**
 * A CommonJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @version 0.1.0
 * @author Clint Andrew Hall
 * @description A CommonJS module for interfacing with Foursquare.
 */
var qs = require('querystring'),
  log4js = require("log4js")(),
  logger = log4js.getLogger("node-foursquare"),
  defaultConfig = {
    "accessTokenUrl" : "https://foursquare.com/oauth2/access_token",
    "authenticateUrl" : "https://foursquare.com/oauth2/authenticate",
    "apiUrl" : "https://api.foursquare.com/v2",
    "log4js" : { }
  };

/**
 *
 * @exports Foursquare
 * @param config
 */
module.exports = function(config) {

  config = config || defaultConfig;
  
  if(!config.accessTokenUrl || !config.apiUrl) {
    throw new TypeError("Supplied configuration is invalid.");
  }

  var core = require("./core")(config);

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
  function getAccessToken(params, callback) {
    params = params || {};
    params.grant_type = params.grant_type || "authorization_code";

    core.retrieve(config.accessTokenUrl + "?" + qs.stringify(params),
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
  }

  /**
   * Exchange a authorization code for an access token with no active user.
   * @param {Object} params A collection of parameters for the Access Token request.
   * @param {String} params.code The code provided by Foursquare as the result of the redirect.
   * @param {String} params.redirect_uri The URL to redirect to after the code is exchanged for a token.
   * @param {String} [params.grant_type="authorization_code"] The type of authorization to request.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getUserlessAccessToken
   * @function
   * @memberOf Foursquare
   * @see https://developer.foursquare.com/docs/oauth.html
   */
  function getUserlessAccessToken(params, callback) {
    params = params || {};
    params.grant_type = params.grant_type || "authorization_code";
    params.client_id = "client_id";
    params.client_secret = "client_secret";

    core.retrieve(config.accessTokenUrl + "?" + qs.stringify(params),
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
  }

  /**
   * Build and return an appropriate Authorization URL where the user can grant permission to the application.
   * @param {String} clientId The Client ID provided by Foursquare
   * @param {String} redirectUrl The URL to redirect to after authorization is granted.
   * @name getAuthClientRedirectUrl
   * @function
   * @memberOf Foursquare
   *
   */
  function getAuthClientRedirectUrl(clientId, redirectUrl) {
    return config.authenticateUrl + "?client_id=" + clientId + "&response_type=code&redirect_uri=" + redirectUrl;
  }

  return {
    "Users" : require("./users")(config),
    "Venues" : require("./venues")(config),
    "Checkins" : require("./checkins")(config),
    "Tips" : require("./tips")(config),
    "Photos" : require("./photos")(config),
    "Settings" : require("./settings")(config),
    "Specials" : require("./specials")(config),
    "getAccessToken" : getAccessToken,
    "getUserlessAccessToken" : getUserlessAccessToken,
    "getAuthClientRedirectUrl" : getAuthClientRedirectUrl
  }
};