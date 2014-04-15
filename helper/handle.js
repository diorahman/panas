/**
 * Dependency modules
 */
var qs = require ("qs");
var _ = require ("lodash");
var mime = require ("mime");
var util = require ("util");
var events = require("events");
var field = require ("./field");
var parse = require ("co-body");
var parsf = require ("co-busboy");
var upload = require ("./upload");
var onFinished = require("finished");


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
    ctx.throw (err.status || 500);
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
    ctx.throw (err.status || 500);
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

/**
 * Generic POST (Content-type : multipart) handler
 */
Handler.prototype.uploadFile = function * (ctx, action, options) {

  if ("POST" != ctx.method) {
    ctx.throw(400);
  }

  try {
    var model = this.model;
    var act = model.thunkified[action];

    var parts = parsf (ctx);

    var form = {};
    var gfsOpt = options.gfsOpt || {};

    while (part = yield parts) {
      if (part.readable) {
        // stream out the part
        gfsOpt.mode = "w";
        gfsOpt.content_type = mime.lookup (part.filename);
        gfsOpt.filename = part.filename;
        var file = yield upload (ctx.gfs, gfsOpt, part);
        form[part.fieldname || "file"] = file; 
      }
      else {
        form = _.merge (form, field(part));
      }
    }

    ctx.body = yield act.call (model.scope, ctx, ctx.gfs, form);

  } catch (err) {
    console.log (err);
    ctx.throw (err.status || 500);
  }
}

/**
 * Generic GET a stream of file
 */
Handler.prototype.downloadFile = function * (ctx, handle, action, options) {
  try {
    var model = handle.model;
    var act = model.thunkified[action];

    var gfsOpt = options.gfsOpt || {};
    gfsOpt.mode = "r";

    // the model's thunkified method should return a valid GridStore options 
    // more info: http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html
    var opt = yield act.call (model.scope, ctx, options);

    // TODO: validate opt
    opt = _.merge(opt, gfsOpt);

    var stream = ctx.body = ctx.gfs.createReadStream(opt);
    onFinished(this, stream.destroy.bind(stream));

  } catch (err) {
    console.log (err);
    ctx.throw (err.status || 500);
  }
}

