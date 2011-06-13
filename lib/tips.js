/**
 * Construct the Foursquare.Tips module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require("./core")(config),
    logger = require('log4js')(config.log4js).getLogger("node-foursquare.Tips");

  /**
   * Retrieve a Tip.
   * @param {String} tipId The id of a Tip.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTip
   * @see https://developer.foursquare.com/docs/tips/tips.html
   */
  function getTip(tipId, accessToken, callback) {
    logger.debug("ENTERING: Tips.getTip");

    if(!tipId) {
      logger.error("getTip: tipId is required.");
      callback(new Error("Tips.getTip: tipId is required."));
      return;
    }

    core.callApi("/tips/" + tipId, accessToken, "tip", null, callback);
  }

  /**
   * Search for tips around a location.
   * @param {String|Number} lat The latitude of the location around which to search.
   * @param {String|Number} lng The longitude of the location around which to search.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @see http://developer.foursquare.com/docs/tips/search.html
   */
  function search(lat, lng, params, accessToken, callback) {
    logger.debug("ENTERING: Tips.getTip");
    params = params || {};

    if(!lat || !lng) {
      logger.error("getTips: Lat and Lng are both required parameters.");
      callback(new Error("searchTips: lat and lng are both required."));
      return;
    }
    params.ll = lat + "," + lng;

    core.callApi("/tips/search", accessToken, "tips", params, callback);
  }

  return {
    "getTip" : getTip,
    "search" : search
  }
};