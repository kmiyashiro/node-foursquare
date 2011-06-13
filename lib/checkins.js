/**
 * Construct the Foursquare.Checkins module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require("./core")(config),
    logger = require('log4js')(config.log4js).getLogger("node-foursquare.Tips");

  /**
   * Retrieve a Foursquare Check-in.
   * @param {String} checkinId The id of the check-in.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getCheckin
   * @see https://developer.foursquare.com/docs/checkins/checkins.html
   */
  function getCheckin(checkinId, params, accessToken, callback) {
    logger.debug("ENTERING: Checkins.getCheckin");

    if(!checkinId) {
      logger.error("getCheckin: checkinId is required.");
      callback(new Error("Checkins.getCheckin: checkinId is required."));
      return;
    }

    core.callApi("/checkins/" + checkinId, accessToken, "checkin", params || {}, callback);
  }

  /**
   * Retreive recent checkins.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getRecentCheckins
   * @see https://developer.foursquare.com/docs/checkins/recent.html
   */
  function getRecentCheckins(params, accessToken, callback) {
    logger.debug("ENTERING: Checkins.getRecentCheckins");
    core.callApi("/checkins/recent", accessToken, "recent", params || {}, callback);
  }

  return {
    "getCheckin" : getCheckin,
    "getRecentCheckins" : getRecentCheckins
  }
};