var sys = require('sys'),
	express = require('express'),
	assert = require('assert'),
  log4js = require("log4js")(),
  config = require('./config').config;

log4js.configure(config.log4js);

var logger = log4js.getLogger("node-foursquare-test"),
  Foursquare = require('./../lib/node-foursquare')(config);
  core = require("./../lib/core")(config);

function reportError(test, message) {
  logger.error(test + " :  \033[22;31mERROR: " + message + "\x1B[0m");
}

function ok(test) {
  logger.info(test + " : \033[22;32mOK\x1B[0m");
}

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
    var params = { "twitter": "naveen" },
      test = "Foursquare.Users.search(twitter=naveen)";
    
    Foursquare.Users.search(params, accessToken, function(error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.results);
          assert.equal(data.results[0].id, "33");
          assert.equal(data.results[0].firstName, "Naveen");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getLeaderboard = function() {
    var test = "Foursquare.Users.getLeaderboard()";
    Foursquare.Users.getLeaderboard({}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.leaderboard);
          assert.ok(data.leaderboard.count >= 0);
          assert.ok(data.leaderboard.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getUser = function() {
    var test = "Foursquare.Users.getUser(self)";
    Foursquare.Users.getUser("self", accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.user);
          assert.ok(data.user.id);
          assert.ok(data.user.firstName);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
    Foursquare.Users.getUser("33", accessToken, function (error, data) {
      var test = "Foursquare.Users.getUser(33)";
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.user);
          assert.equal(data.user.id, "33");
          assert.equal(data.user.firstName, "Naveen");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getBadges = function() {
    var test = "Foursquare.Users.getBadges(self)";
    Foursquare.Users.getBadges(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.badges);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getCheckins = function() {
    var test = "Foursquare.Users.getCheckins(self)";
    Foursquare.Users.getCheckins(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.checkins);
          assert.ok(data.checkins.count >= 0);
          assert.ok(data.checkins.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getFriends = function() {
    var test = "Foursquare.Users.getFriends(self)";
    Foursquare.Users.getFriends(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.friends);
          assert.ok(data.friends.count >= 0);
          assert.ok(data.friends.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getTips = function() {
    var test = "Foursquare.Users.getTips(self)";
    Foursquare.Users.getTips(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.tips);
          assert.ok(data.tips.count >= 0);
          assert.ok(data.tips.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getTodos = function() {
    var test = "Foursquare.Users.getTodos(self)";
    Foursquare.Users.getTodos(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.todos);
          assert.ok(data.todos.count >= 0);
          assert.ok(data.todos.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getVenueHistory = function() {
    var test = "Foursquare.Users.getVenueHistory(self)";
    Foursquare.Users.getVenueHistory(null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.venues);
          assert.ok(data.venues.count >= 0);
          assert.ok(data.venues.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Users.getRequests = function() {
    var test = "Foursquare.Users.getRequests()";
    Foursquare.Users.getRequests(accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.requests);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.search = function() {
    var test = "Foursquare.Venues.search(40.7, -74)";
    Foursquare.Venues.search("40.7", "-74", {}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.groups);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getTrending = function() {
    var test = "Foursquare.Venues.getTrending(40.7, -74)";
    Foursquare.Venues.getTrending("40.7", "-74", {}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.venues);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getCategories = function() {
    var test = "Foursquare.Venues.getCategories()";
    Foursquare.Venues.getCategories({}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.categories);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.explore = function() {
    var test = "Foursquare.Venues.explore(40.7, -74)";
    Foursquare.Venues.explore("40.7", "-74", {}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.keywords);
          assert.ok(data.groups);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getVenue = function() {
    var test = "Foursquare.Venues.getVenue(5104)";
    Foursquare.Venues.getVenue(5104, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.venue);
          assert.equal(data.venue.id, "40a55d80f964a52020f31ee3");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getHereNow = function() {
    var test = "Foursquare.Venues.getHereNow(5104)";
    Foursquare.Venues.getHereNow(5104, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.hereNow);
          assert.ok(data.hereNow.count >= 0);
          assert.ok(data.hereNow.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getTips = function() {
    var test = "Foursquare.Venues.getTips(5104)";
    Foursquare.Venues.getTips(5104, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.tips);
          assert.ok(data.tips.count >= 0);
          assert.ok(data.tips.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getPhotos = function() {
    var test = "Foursquare.Venues.getPhotos(5104)";
    Foursquare.Venues.getPhotos(5104, null, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.photos);
          assert.ok(data.photos.count >= 0);
          assert.ok(data.photos.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Venues.getLinks = function() {
    var test = "Foursquare.Venues.getLinks(5104)";
    Foursquare.Venues.getLinks(5104, null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.links);
          assert.ok(data.links.count >= 0);
          assert.ok(data.links.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Checkins.getCheckin = function() {
    var test = "Foursquare.Checkins.getCheckin(4dae3f9e4df0f639f248ca13)";
    Foursquare.Checkins.getCheckin("4dae3f9e4df0f639f248ca13", null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.checkin);
          assert.equal(data.checkin.id, "4dae3f9e4df0f639f248ca13");
          assert.equal(data.checkin.type, "checkin");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Checkins.getRecentCheckins = function() {
    var test = "Foursquare.Checkins.getRecentCheckins()";
    Foursquare.Checkins.getRecentCheckins(null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.recent);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Tips.getTip = function() {
    var test = "Foursquare.Tips.getTip(4b5e662a70c603bba7d790b4)";
    Foursquare.Tips.getTip("4b5e662a70c603bba7d790b4", accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.tip);
          assert.equal(data.tip.id, "4b5e662a70c603bba7d790b4");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Tips.search = function() {
    var test = "Foursquare.Tips.search(lat: 40.7, lng: -74)";
    Foursquare.Tips.search("40.7", "-74", null, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.tips);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Photos.getPhoto = function() {
    var test = "Foursquare.Photos.getPhoto(4d0fb8162d39a340637dc42b)";
    Foursquare.Photos.getPhoto("4d0fb8162d39a340637dc42b", accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.photo);
          assert.equal(data.photo.id, "4d0fb8162d39a340637dc42b");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Settings.getSettings = function() {
    var test = "Foursquare.Settings.getSettings()";
    Foursquare.Settings.getSettings(accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.settings);
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Settings.getSetting = function() {
    var test = "Foursquare.Settings.getSetting('receivePings')";
    Foursquare.Settings.getSetting("receivePings", accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(typeof data.value !== "undefined");
          ok(test);
        } catch (error) {
          reportError(test, error);
        }
      }
    });
  };

  Tests.Specials.search = function() {
    var test = "Foursquare.Specials.search(40.7, -74)";
    Foursquare.Specials.search("40.7", "-74", {}, accessToken, function (error, data) {
      if(error) {
        reportError(test, error.message);
      }
      else {
        try {
          logger.trace(sys.inspect(data));
          assert.ok(data.specials);
          assert.ok(data.specials.count >= 0);
          assert.ok(data.specials.items);
          ok(test);
        } catch (error) {
          reportError(test, error);
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

// Using express was just faster... *sigh*
var app = express.createServer();

app.get('/', function(req, res) {
  var url = Foursquare.getAuthClientRedirectUrl(config.clientId, config.redirectUrl);
  sys.log(url);
	res.writeHead(303, { "location": url });
	res.end();
});

app.get('/callback', function (req, res) {

  Foursquare.getAccessToken({
    code: req.query.code
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
  var accessToken = req.query.token || null;
  TestSuite(accessToken).execute();
  res.send('<html></html><title>Testing...</title><body>Please check the console.</body></html>');
});

app.listen(3000);