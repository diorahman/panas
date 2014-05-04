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
var Readable = require("stream").Readable;
var Writable = require("stream").Writable;

/**
 * Expose handler
 */
module.exports = Handler;

function handleError(ctx, err){
  ctx.status = err.status || 500; 
  ctx.body = err;
  ctx.app.emit("error", err, ctx);
};

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
    handleError(ctx, err);
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
    handleError(ctx, err);
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
        var fieldName = part.fieldname;
        var file = yield upload (ctx.gfs, gfsOpt, part);
        form[fieldName || "file"] = file; 
      }
      else {
        form = _.merge (form, field(part));
      }
    }

    ctx.body = yield act.call (model.scope, ctx, ctx.gfs, form);

  } catch (err) {
    handleError(ctx, err);
  }
}

/**
 * Generic GET a stream of file
 */
Handler.prototype.downloadFile = function * (ctx, action, options) {
  try {
    var model = this.model;
    var act = model.thunkified[action];

    var gfsOpt = options.gfsOpt || {};
    gfsOpt.mode = "r";

    // the model's thunkified method should return a valid GridStore options 
    // more info: http://mongodb.github.com/node-mongodb-native/api-generated/gridstore.html
    var opt = yield act.call (model.scope, ctx, options);

    // TODO: validate opt
    opt = _.merge(opt, gfsOpt);

    if (!ctx.query.hasOwnProperty("stream")) {
      ctx.set("Cache-Control", "no-cache");
      ctx.attachment(opt.filename || "file" );
    }

    var rs = Readable();
    var ws = Writable();
    rs._read = function(){};
    ws._write = function(chunk, enc, next){      
      rs.push(chunk);
      next();
    }
    
    var stream = ctx.gfs.createReadStream(opt);
    stream.pipe(ws);
    stream.on("end", function(){
      rs.push(null);
    });

    ctx.type = opt.contentType || "application/octet-stream"
    ctx.body = rs;
    onFinished(ctx, stream.destroy.bind(stream));

  } catch (err) {
    handleError(ctx, err);
  }
}
