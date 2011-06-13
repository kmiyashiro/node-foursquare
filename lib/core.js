var exports = module.exports,
  qs = require('querystring'),
  sys = require("sys"),
  https = require('https'),
  urlParser = require('url'),
  logger = require('log4js')().getLogger("node-foursquare.core"),
  emptyCallback = function() { };

/**
 * Construct the Core module.
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {

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

  function invokeApi(url, accessToken, callback) {

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

  function extractData(status, result, fields, callback) {
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
        if(json.response !== undefined && fields.length > 0) {
          var reply = {};
          fields.forEach(function(field) {
            reply[field] = json.response[field];
          });
          callback(null, reply);
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

  function callApi(path, accessToken, fields, params, callback) {

    var url = config.apiUrl + path;

    if(typeof fields == "string") {
      fields = [fields];
    }

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
    invokeApi(url, accessToken, function(error, status, result) {
      extractData(status, result, fields, callback);
    });
  }
  
  return {
    "retrieve" : retrieve,
    "invokeApi" : invokeApi,
    "extractData" : extractData,
    "callApi" : callApi
  }
};
