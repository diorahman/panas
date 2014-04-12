var koa = require ("koa");
var qsify = require ("koa-qs");
var helper = require ("./helper");
var boot = require ("./lib/boot");
var mount = require ("koa-mount");
var compose = require ("koa-compose");

var main = function (options) {
  
  var point = options.point || "/api/1";
  var api = koa();

  qsify (api);

  api.use (compose(boot(options).stack));

  var scope = {
    type : "api",
    path : __dirname,
    mount : mount (point, api),
  }

  var connect = helper.db.connect(options, api, scope);
  var close = helper.db.close(options);

  scope.burn = connect;
  scope.connect = connect;
  scope.close = close;

  return scope;
}

module.exports = {
  api : main,
  helper : helper
}
