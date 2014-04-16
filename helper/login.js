var plug = require ("./plug");
var request = require ("request");
var debug = require ("debug")("panas-helper-login");

/**
 * Login helper
 */
module.exports = function (options, user, replace, cb) {

  if (!options) throw new TypeError("login settings needed");
  if (!options.app) throw new TypeError("login app needed");

  var uri = "/api/1/account/login" || options.url;
  var port = 64436; // todo, randomize!
  var s = options.app.listen (port);
  var opt = {
    url : "http://localhost:" + port +  uri, 
    json : user
  };

  request.post (opt, function (err, res, body){
    s.close ();
    s = null;
    if (err) return cb(err);
    if (!res.body || res.statusCode != 200) return cb (new Error ("login failed"));

    var user = {};

    try {
      user = body;
      debug ("login as: " + user[ options.username || "email" ]);
      plug (options.app, "session", { user : user}, replace || false );
    } catch (err) {
      return cb (err);
    }
    return cb (null, user);
  });
}