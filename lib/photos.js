/**
 * Construct the Foursquare.Photos module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require("./core")(config),
    logger = require('log4js')(config.log4js).getLogger("node-foursquare.Photos");

  /**
   * Retrieve a photo from Foursquare.
   * @param {String} photoId The id of the Photo to retreive.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/photos/photos.html
   */
  function getPhoto(photoId, accessToken, callback) {
    logger.debug("ENTERING: Photos.getPhoto");

    if(!photoId) {
      logger.error("getPhoto: photoId is required.");
      callback(new Error("Photos.getPhoto: photoId is required."));
      return;
    }
    core.callApi("/photos/" + photoId, accessToken, "photo", null, callback);
  }

  return {
    "getPhoto" : getPhoto
  }
};
