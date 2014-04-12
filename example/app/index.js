var mongoose = require ("mongoose");
var panas = require ("../../");
var koa = require ("koa");

module.exports = function(options){
  return koa().use (panas.api(options).burn());
}
