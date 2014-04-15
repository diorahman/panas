var plug = require ("plug");
var debug = require ("debug")("panas-helper-login");

/**
 * Login helper
 */
var login = function (options, user, replace, cb) {

  if (!options) throw new TypeError("login settings needed");
  if (!options.app) throw new TypeError("login app needed");
  if (!options.toServer) throw new TypeError("login toServer needed");

  var uri = "/api/1/account/login" || options.url;
  request (options.toServer).post(uri).send(user).end(
    function (err, res) {
      if (err) return cb(err);
      if (!res.body || res.status != 200) return cb (new Error ("login failed"));

      var user = res.body;
      debug ("login as: " + user[ options.username || "email" ]);
      plug (options.app, "session", { user : user}, replace || false );
      cb (null, user);
    } 
  );
}