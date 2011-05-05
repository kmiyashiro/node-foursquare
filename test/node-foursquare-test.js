var sys = require('sys'),
	express = require('express'),
	assert = require('assert'),
  logger = require("log4js")().getLogger("node-foursquare-test");

var Foursquare = require('./../lib/node-foursquare').Foursquare(),
	config = require('./config').config;

function TestSuite(accessToken) {
  var Tests = {
    "Users" : {},
    "Venues" : {},
    "Checkins" : {},
    "Tips" : {},
    "Photos" : {},
    "Settings" : {},
    "Specials" : {}
  };

  Tests.Users.search = function() {
    var params = { "twitter": "clintandrewhall" };
    Foursquare.Users.search(params, accessToken, function(error, data) {
      if(error) {
        logger.error("Foursquare.Users.search(twitter=clintandrewhall) \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data[0].id, "62243");
          logger.info("Foursquare.Users.search(twitter=clintandrewhall) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.search(twitter=clintandrewhall) \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getUser = function() {
    Foursquare.Users.getUser("self", accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getUser \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getUser(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getUser \033[22;31mERROR: " + error.message);
        }
      }
    });
    Foursquare.Users.getUser("62243", accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getUser \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data.id, "62243");
          logger.info("Foursquare.Users.getUser(62243) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getUser \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getBadges = function() {
    Foursquare.Users.getBadges(null, null, accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getBadges \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getBadges(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getBadges \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getCheckins = function() {
    Foursquare.Users.getCheckins(null, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getCheckins \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getCheckins(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getCheckins \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getFriends = function() {
    Foursquare.Users.getFriends(null, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getFriends \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getFriends(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getFriends \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getTips = function() {
    Foursquare.Users.getTips(null, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getTips \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getTips(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getTips \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getTodos = function() {
    Foursquare.Users.getTodos(null, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getTodos \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getTodos(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getTodos \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Users.getVenueHistory = function() {
    Foursquare.Users.getVenueHistory(null, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Users.getVenueHistory \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Users.getVenueHistory(self) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Users.getVenueHistory \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.search = function() {
    var query = { "lat": "40.7", "lng" : "-74" };
    Foursquare.Venues.search(query, accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.search \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data[0].type, "trending");
          logger.info("Foursquare.Venues.search(lat: 40.7, lng: -74) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.search \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.trending = function() {
    var query = { "lat": "40.7", "lng" : "-74" };
    Foursquare.Venues.trending(query, accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.trending \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data[0].hereNow.count > 0);
          logger.info("Foursquare.Venues.trending(lat: 40.7, lng: -74) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.trending \033[22;31mERROR: " + error.message);
        }
      }
    });
  };


  Tests.Venues.getVenue = function() {
    Foursquare.Venues.getVenue(5104, accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.getVenue \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data.id, "40a55d80f964a52020f31ee3");
          logger.info("Foursquare.Venues.getVenue(5104) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.getVenue \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.getHereNow = function() {
    Foursquare.Venues.getHereNow(5104, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.getHereNow \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Venues.getHereNow(5104) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.getHereNow \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.getTips = function() {
    Foursquare.Venues.getTips(5104, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.getTips \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Venues.getTips(5104) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.getTips \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.getPhotos = function() {
    Foursquare.Venues.getPhotos(5104, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.getPhotos \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Venues.getPhotos(5104) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.getPhotos \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Venues.getLinks = function() {
    Foursquare.Venues.getLinks(5104, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Venues.getLinks \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Venues.getLinks(5104) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Venues.getLinks \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Checkins.getCheckin = function() {
    Foursquare.Checkins.getCheckin("4dae3f9e4df0f639f248ca13", accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Checkins.getCheckin \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data.id, "4dae3f9e4df0f639f248ca13");
          logger.info("Foursquare.Checkins.getCheckin(4dae3f9e4df0f639f248ca13) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Checkins.getCheckin \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Checkins.getRecentCheckins = function() {
    Foursquare.Checkins.getRecentCheckins(accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Checkins.getRecentCheckins \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Checkins.getRecentCheckins() : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Checkins.getRecentCheckins \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Tips.getTip = function() {
    Foursquare.Tips.getTip("4b5e662a70c603bba7d790b4", accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Tips.getTip \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Tips.getTip(4b5e662a70c603bba7d790b4) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Tips.getTip \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Tips.search = function() {
	  var query = { "lat" : "40.7", "lng" : "-74" };

    Foursquare.Tips.search(query, accessToken, null, function (error, data) {
      if(error) {
        logger.error("Foursquare.Tips.search \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Tips.search(lat: 40.7, lng: -74) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Tips.search \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Photos.getPhoto = function() {
    Foursquare.Photos.getPhoto("4d0fb8162d39a340637dc42b", accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Photos.getPhoto \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.equal(data.id, "4d0fb8162d39a340637dc42b");
          logger.info("Foursquare.Photos.getPhoto(4d0fb8162d39a340637dc42b) : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Photos.getPhoto \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  Tests.Settings.getSettings = function() {
    Foursquare.Settings.getSettings(accessToken, function (error, data) {
      if(error) {
        logger.error("Foursquare.Settings.getPhoto \033[22;31mERROR: " + error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data);
          logger.info("Foursquare.Settings.getSettings() : \033[22;32mOK");
        } catch (error) {
          logger.error("Foursquare.Settings.getSettings \033[22;31mERROR: " + error.message);
        }
      }
    });
  };

  return {
    "Tests" : Tests,
    "execute" : function(testGroup, testName) {
      for(var group in Tests) {
        if(!testGroup || (testGroup && testGroup == group)) {
          for(var test in Tests[group]) {
            if(!testName ||(testName && testName == test)) {
              var t = Tests[group][test];
              if(t && typeof(t) == "function") {
                logger.debug("Running: " + test);
                t.call(this);
              }
            }
          }
        }
      }
    }
  }
}

var app = express.createServer();

app.get('/login', function(req, res) {
  var url = Foursquare.getAuthClientRedirectUrl(config.clientId, config.redirectUrl);
  sys.log(url);
	res.writeHead(303, { "location": url });
	res.end();
});

  app.get('/callback', function (req, res) {

    var code = req.query.code;

    Foursquare.getAccessToken({
      code: code,
      redirect_uri: config.redirectUrl,
      client_id: config.clientId,
      client_secret: config.clientSecret
    }, function (error, accessToken) {
      if(error) {
        res.send("An error was thrown: " + error.message);
      }
      else {
        res.redirect("/test?token=" + accessToken);
      }
    });
  });

app.get("/test", function(req, res) {
  var accessToken = req.query.token;

  if (accessToken !== undefined) {
    TestSuite(accessToken).execute();
    res.send('<html></html><title>Testing...</title><body>Please check the console.</body></html>');
  } else {
    res.send("accessToken was not successfully retreived.");
  }
});

app.get('/', function(req, res){
    res.send("Please <a href=\"/login\">login</a> to run the tests");
});

app.listen(3000);