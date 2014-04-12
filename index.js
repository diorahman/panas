var koa = require ("koa");
var qsify = require ("koa-qs");
var helper = require ("./helper");
var mount = require ("koa-mount");
var boot = require ("./lib/boot");
var compose = require ("koa-compose");

var main = function (options) {
  
  var point = options.point || "/api/1";

  var api = koa();
  qsify (api);

  api.use (compose(boot(options).stack));

  return {
    mount : mount (point, api),
    path : __dirname,
    type : "api"
  }
}

module.exports = {
  api : main,
  helper : helper
}
