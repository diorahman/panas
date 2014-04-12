var debug = require ("debug") ("user-bootstrap");
var async = require ("async");
var data = require ("./data");

var User = require ("../schemas/user");

function save(user, cb){
  debug ( "create %s", user.name );
  var user = new User(user);
  user.save(cb);
}

var main = function (done) {
  User.remove(function(){
    async.mapSeries (data, save, done);  
  });
}

/**
* Expose
*/
module.exports = function (options) {
  // prepared for options
  return main;
}

