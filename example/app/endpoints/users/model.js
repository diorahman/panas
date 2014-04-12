// require ("panas").helper;
var helper = require ("../../../../").helper;
var thunkified = helper.thunkified;

var ResourceUser = require ("../../resources/user");
var User = ResourceUser.schemas.User;

/**
 * User class
 */
function User (options) {
  if (!(this instanceof User)) return new User(options);
  this.name = "user";
}

User.prototype.find = function (ctx, options, cb) {
  
  var promise = User.find({}).exec();
  promise.addErrback(cb);
  promise.then(function(users){
    cb (null, users);
  });
}

module.exports = thunkified (User());