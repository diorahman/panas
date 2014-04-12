var thunkify = require ("thunkify");
var is = require ("is");

/**
 * Return a set of scope's thunkified functions and the scope itself
 */
module.exports = function (scope) {

  var proc = {};
  
  for (var key in scope) {
    if (is.fn(scope[key])) {
      proc[key] = thunkify (scope[key]);  
    }
  }

  return {
    thunkified : proc,
    scope : scope
  }
}