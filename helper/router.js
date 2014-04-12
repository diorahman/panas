/**
 * Dependency modules
 */
var is = require ("is");
var util = require ("util");
var Router = require ("koa-router");

// supported methods
var methods = ["get", "post", "put", "del", "head", "option"];

function handle (router, method) {
  return function(path, handler){
    router[method](router.namespace, path, router.filter, handler);
  }
}

/**
 * A koa-route wrapper to set namespace and middleware before handler
 */
function RouterWrapper(namespace, filter) {
  
  Router.call(this);
  this.filter = filter;
  this.namespace = namespace;

  for (var method in this) {
    if (is.fn(this[method]) && methods.indexOf(method) >= 0) {
      this[method.toUpperCase()] = handle (this, method);
    }
  }
}

util.inherits (RouterWrapper, Router);

module.exports = RouterWrapper;
