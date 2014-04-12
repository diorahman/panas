/**
 * Dependency modules
 */
var Router = require ("koa-router");
var unify = require ("./unify");
var path = require ("path");
var fs = require ("fs");

/**
 * Expose bootstrap
 */
module.exports = bootstrap;

/**
 * The bootstrap function for APIs
 */
function bootstrap (options) {

  options = options || {};

  var root = options.root;
  var endpoints = fs.readdirSync(options.root);
  var routes = [];
  var stack = [];

  // inspect each directory in api/ends and load the configured router
  endpoints.forEach (function(endpoint) {
    if (!path.extname (endpoint)) {
      var router = require (path.join(root, endpoint));
      var api = router (endpoint, options);
      routes.push (unify(api));
      stack.push (api.middleware());
    }
  });

  var doc = new Router();
  doc.get ("/_doc", function * () { this.body = routes; });
  stack.push(doc.middleware());

  return {

    // routes contains unified json format routes
    routes : routes,

    // stack of middlewares
    stack : stack

  }
}


