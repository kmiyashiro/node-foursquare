/**
 * A module for retrieving information about Settings from Foursquare.
 * @module node-foursquare/Settings
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require("./core")(config),
    path = require("path"),
    logger = require('log4js')(config.log4js).getLogger("node-foursquare.Settings");

  /**
   * Retreive Foursquare settings for the current user.
   * @memberof module:node-foursquare/Settings
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSettings(accessToken, callback) {
    logger.debug("ENTERING: Settings.getSettings");
    core.callApi("/settings/all", accessToken, null, callback);
  }

  /**
   * Retreive a specific Foursquare setting for the current user.
   * @memberof module:node-foursquare/Settings
   * @param {String} name The name of the setting to retrieve
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSetting(name, accessToken, callback) {
    logger.debug("ENTERING: Settings.getSetting");

    if (!name) {
      logger.error("getSetting: name is required.");
      callback(new Error("Settings.getSetting: name is required."));
      return;
    }

    core.callApi(path.join("/settings/", name), accessToken, null, callback);
  }

  return {
    "getSettings" : getSettings,
    "getSetting" : getSetting
  }
};