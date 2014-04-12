/**
 * Dependency modules
 */
var qs = require ("qs");
var _ = require ("lodash");
var util = require ("util");
var events = require("events");
var parse = require ("co-body");

/**
 * Expose handler
 */
module.exports = Handler;

/**
 * Handler function
 * Prepared as event emitter, hence we can use it as handler-centric error handler
 */
function Handler(model) {

  if (!(this instanceof Handler)) return new Handler (model);
  events.EventEmitter.call(this);
  this.model = model;
}

util.inherits(Handler, events.EventEmitter);

/**
 * Generic GET handler
 */
Handler.prototype.get = function * (ctx, action, options) {
  try {
    var model = this.model;
    var act = model.thunkified[action];
    
    // todo: in GET, we need to consider ctx.params, ctx.query, ctx.session and options from caller
    ctx.body = yield act.call (model.scope, ctx, {});

  } catch (err) {
    console.log (err);
    ctx.throw (err.status);
  }
}

/**
 * Generic POST (Content-type: application/json) handler
 */
Handler.prototype.post = function * (ctx, action, options) {
  try {
    var model = this.model;
    var act = model.thunkified[action];

    // request info
    var body = yield parse(ctx);
    
    // todo: in POST, we need to consider ctx.params, ctx.body, ctx.session and options from caller
    ctx.body = yield act.call (model.scope, ctx, { body : body });

  } catch (err) {
    console.log (err);
    ctx.throw (err.status);
  }
}

/**
 * Generic PUT handler
 */
Handler.prototype.put = function * (ctx, action, options) {
  yield this.post(ctx, action, options);
}

/**
 * Generic DELETE handler
 */
Handler.prototype.del = function * (ctx, action, options) {
  yield this.get(ctx, action, options);
}