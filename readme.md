node-foursquare
==================

Fault-tolerant Foursquare API wrapper for Node JS.

Install
-------

    npm install node-foursquare


Use
---

The Foursquare module takes an optional parameter in case you want/need to specify alternate URLs for Foursquare, (that
is unlikely).

    var foursquare = require("node-foursquare").Foursquare();

Once instantiated, you just need to set up the correct endpoints on your own server that match your OAuth configuration
in Foursquare.  Using express, for example:

    var app = express.createServer();

    app.get('/login', function(req, res) {
      var url = Foursquare.getAuthClientRedirectUrl([YOUR_CLIENT_ID], [YOUR_REDIRECT]);
      res.writeHead(303, { "location": url });
      res.end();
    });


    app.get('/callback', function (req, res) {
      var code = req.query.code;

      Foursquare.getAccessToken({
        code: code,
        redirect_uri: [YOUR_REDIRECT],
        client_id: [YOUR_CLIENT_ID],
        client_secret: [YOUR_CLIENT_SECRET]
      }, function (error, accessToken) {
        if(error) {
          res.send("An error was thrown: " + error.message);
        }
        else {
          // Save the accessToken and redirect.
        }
      });
    });

All methods within the module require the Access Token from the callback.

For more details and examples, take a look at the test oracle in the /test directory.

Testing
-------

To test, you need to create a config.js file in the /test directory as follows:

    exports.config = {
      "clientId" : [YOUR_CLIENT_ID],
      "clientSecret" : [YOUR_CLIENT_SECRET],
      "redirectUrl" : [YOUR_REDIRECT]
    };

Then, simply invoke the test.js file with Node.JS:

    node test.js

After a redirect and authorization, you'll be see test results in the console window.


Documentation
-------------

Detailed documentation is available in the /docs directory.

Notes
-----

This module is a read-only subset of the full Foursquare API, but further capability, (adding, posting, updating, etc),
is forthcoming. Bugs and Pull Requests are, of course, accepted! :-)

This project is a refactoring and enhancement of: https://github.com/yikulju/Foursquare-on-node