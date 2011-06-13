/**
 * Construct the Foursquare.Settings module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require("./core")(config),
    logger = require('log4js')(config.log4js).getLogger("node-foursquare.Settings");

  /**
   * Retreive Foursquare settings for the current user.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getSettings
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSettings(accessToken, callback) {
    logger.debug("ENTERING: Settings.getSettings");
    core.callApi("/settings/all", accessToken, "settings", null, callback);
  }

  /**
   * Retreive a specific Foursquare setting for the current user.
   * @param {String} name The name of the setting to retrieve
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getSetting
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSetting(name, accessToken, callback) {
    logger.debug("ENTERING: Settings.getSetting");

    if (!name) {
      logger.error("getSetting: name is required.");
      callback(new Error("Settings.getSetting: name is required."));
      return;
    }

    core.callApi("/settings/" + name, accessToken, "value", null, callback);
  }

  return {
    "getSettings" : getSettings,
    "getSetting" : getSetting
  }
};