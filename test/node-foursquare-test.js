var sys = require('sys'),
	express = require('express'),
	assert = require('assert');

var Foursquare = require('./../lib/node-foursquare').Foursquare(),
	config = require('./config').config;

// Test functions
function testUserCheckins(accessToken) {

	var params = {
		limit: 200
	};

	Foursquare.getUserCheckins("self", accessToken, params, function (error, data) {
    if(error) {
			console.log("-> userCheckins ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.notStrictEqual(data.count, undefined);
        console.log("-> userCheckins OK");
      } catch (e) {
        console.log("-> userCheckins ERROR: " + sys.inspect(e));
      }
    }
  });
}

function testUserBadges(accessToken) {
	Foursquare.getUserBadges("self", accessToken, function (error, data) {
    if(error) {
			console.log("-> userBadges ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.notStrictEqual(data, undefined);
        console.log("-> userBadges OK");
      } catch (e) {
        console.log("-> userBadges ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testUserSearch(accessToken) {

	var query = { twitter: "naveen" };

	Foursquare.searchUsers(query, accessToken, function (error, data) {
    if(error) {
			console.log("-> searchUser ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.equal(data[0].id, '33');
        console.log("-> searchUser OK");
      } catch (e) {
        console.log("-> searchUser ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testVenueSearch(accessToken) {

	var query = { ll: "40.7, -74" };

	Foursquare.searchVenues(query, accessToken, function (error, data) {
    if(error) {
			console.log("-> searchVenue ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.equal(data[0].type, 'trending');
        console.log("-> searchVenue OK");
      } catch (e) {
			  console.log("-> searchVenue ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testTipSearch(accessToken) {

	var query = { ll: "40.7, -74" };

	Foursquare.searchTips(query, accessToken, function (error, data) {
    if(error) {
			console.log("-> searchTips ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.equal(data[0].text, 'It is time for espresso');
        console.log("-> searchTips OK");
      } catch (e) {
			console.log("-> searchTips ERROR: " + sys.inspect(e));
      }
    }
	});
}


function testGetRecentCheckins(accessToken) {

	Foursquare.getRecentCheckins( { limit: "20" }, accessToken, function (error, data) {
    if(error) {
			console.log("-> getRecentCheckins ERROR: " + sys.inspect(error));
    }
    else {
      try {
        var result = JSON.stringify(data);
        assert.ok(result);
        console.log("-> getRecentCheckins OK");
      } catch (e) {
			console.log("-> getRecentCheckins ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testGetSettings(accessToken) {

	Foursquare.getSettings(accessToken, function (error, data) {
    if(error) {
			console.log("-> getSettings ERROR: " + sys.inspect(error));
    }
    else {
      try {
        var result = JSON.stringify(data);
        assert.ok(result);
        console.log("-> getSettings OK");
      } catch (e) {
			console.log("-> getSettings ERROR: " + sys.inspect(e));
      }
    }
	});
}


function testGetPhoto(accessToken) {

	Foursquare.getPhoto("4d0fb8162d39a340637dc42b", accessToken, function (error, data) {
    if(error) {
			console.log("-> getPhoto ERROR: " + sys.inspect(error));
    }
    else {
      try {
        var result = data.id;
        assert.equal(result, "4d0fb8162d39a340637dc42b");
        console.log("-> getPhoto OK");
      } catch (e) {
			console.log("-> getPhoto ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testGetUser(accessToken) {

	Foursquare.getUser("self", accessToken, function (error, data) {
    if(error) {
			console.log("-> getUser ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.ok(data);
        console.log("-> getUser OK");
      } catch (e) {
			console.log("-> getUser ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testGetVenue(accessToken) {

	Foursquare.getVenue(5104, accessToken, function(error, data) {
    if(error) {
			console.log("-> getVenue ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.equal(data.id, "40a55d80f964a52020f31ee3");
        console.log("-> getVenue OK");
      } catch (e) {
			console.log("-> getVenue ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testGetVenueAspect(accessToken) {
	Foursquare.getVenueAspect("3fd66200f964a5206be61ee3", accessToken, "tips", null, function(error, data) {
    if(error) {
			console.log("-> getVenueAspect ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.ok(data.items[0]);
        console.log("-> getVenueAspect OK");
      } catch (e) {
			console.log("-> getVenueAspect ERROR: " + sys.inspect(e));
      }
    }
  });
}

function testGetCheckin(accessToken) {

	Foursquare.getCheckin("IHR8THISVNU", accessToken, function (error, data) {
    if(error) {
			console.log("-> getCheckin ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.ok(data);
        console.log("-> getCheckin OK");
      } catch (e) {
			console.log("-> getCheckin ERROR: " + sys.inspect(e));
      }
    }
	});
}

function testGetTip(accessToken) {

	Foursquare.getTip("4b5e662a70c603bba7d790b4", accessToken, function (data) {
    if(error) {
			console.log("-> getTip ERROR: " + sys.inspect(error));
    }
    else {
      try {
        assert.equal(data.id, "4b5e662a70c603bba7d790b4");
        console.log("-> getTip OK");
      } catch (e) {
			  console.log("-> getTip ERROR: " + sys.inspect(error));
      }
    }
	});
}

var app = express.createServer();

app.get('/login', function(req, res) {
	var loc = "https://foursquare.com/oauth2/authenticate?client_id=" + config.clientId + "&response_type=code&redirect_uri=" + config.redirectUri;
	res.writeHead(303, { 'location': loc });
	res.end();
});

app.get('/callback', function (req, res) {

	var code = req.query.code;

	Foursquare.getAccessToken({
		code: code,
		redirect_uri: config.redirectUri,
		client_id: config.clientId,
		client_secret: config.clientSecret
	}, function (error, accessToken) {

    if(error) {
      res.send("An error was thrown: " + sys.inspect(error));
    }
		else if (accessToken !== undefined) {
			testUserCheckins(accessToken);
			testUserBadges(accessToken);
			testTipSearch(accessToken);
			testUserSearch(accessToken);
			testVenueSearch(accessToken);
			testGetRecentCheckins(accessToken);
			testGetSettings(accessToken);
			testGetPhoto(accessToken);
			testGetUser(accessToken);
			testGetVenue(accessToken);
			testGetVenueAspect(accessToken);
			testGetCheckin(accessToken);
			testGetTip(accessToken);
			res.send('Please check the console.');
		} else {
			console.log("accessToken is undefined.");
		}

	});
});

app.get('/', function(req, res){
    res.send("Please <a href=\"/login\">login</a> to run the tests");
});


app.listen(30000);