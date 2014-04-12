// require ("panas").helper;
var helper = require ("../../../../").helper;
var model = require ("./model");
var handle = helper.Handle (model);

module.exports = User;

/**
 * The User handlers
 */
function User (options) {
  if (!(this instanceof User)) return new User (options);
}

User.prototype.find = function * (){
  yield handle.get (this, "find", {});
}
