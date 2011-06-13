/**
 * A CommonJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @version 0.1.0
 * @author Clint Andrew Hall
 * @description A CommonJS module for interfacing with Foursquare.
 */
var qs = require('querystring'),
  defaultConfig = {
    "foursquare" : {
      "accessTokenUrl" : "https://foursquare.com/oauth2/access_token",
      "authenticateUrl" : "https://foursquare.com/oauth2/authenticate",
      "apiUrl" : "https://api.foursquare.com/v2"
    },
    "log4js" : { },
    "secrets" : { }
  };

/**
 * Construct the node-foursquare module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {

  config = config || defaultConfig;
  config.foursquare = config.foursquare || defaultConfig.foursquare;
  config.log4js = config.log4js || defaultConfig.log4js;

  if(!config.foursquare.accessTokenUrl || !config.foursquare.apiUrl) {
    throw new TypeError("Supplied configuration is invalid.");
  }

  var core = require("./core")(config),
    logger = require("log4js")(config.log4js).getLogger("node-foursquare");

  if(!config.secrets || !config.secrets.clientId || !config.secrets.clientSecret || !config.secrets.redirectUrl) {
    logger.error("Client configuration not supplied; add config.secrets information, (client_id, client_secret, redirect_uri).");
    throw new Error("Client information not supplied.");
  }

  /**
   * Exchange a user authorization code for an access token.
   * @param {Object} params A collection of parameters for the Access Token request.
   * @param {String} params.code The code provided by Foursquare as the result of the user redirect.
   * @param {String} [params.grant_type="authorization_code"] The type of authorization to request.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getAccessToken
   * @see https://developer.foursquare.com/docs/oauth.html
   */
  function getAccessToken(params, callback) {
    params = params || {};
    params.grant_type = params.grant_type || "authorization_code";
    params.client_id = config.secrets.clientId;
    params.client_secret = config.secrets.clientSecret;
    params.redirect_uri = config.secrets.redirectUrl;

    core.retrieve(config.foursquare.accessTokenUrl + "?" + qs.stringify(params),
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
   * @name getAuthClientRedirectUrl
   */
  function getAuthClientRedirectUrl() {
    return config.foursquare.authenticateUrl + "?client_id=" + config.secrets.clientId + "&response_type=code&redirect_uri=" + config.secrets.redirectUrl;
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
    "getAuthClientRedirectUrl" : getAuthClientRedirectUrl
  }
};