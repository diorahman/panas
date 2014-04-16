var changeCase = require ("change-case");
var async = require ("async");
var _ = require ("lodash");
var is = require ("is");

module.exports = function (params, cb) {

  var ops = params.ctx.operations || [];
  var options = params.options;
  var prefix = params.prefix;
  var scope = params.scope;
  var ctx = params.ctx;
  var tasks = {};

  if (ops.length == 0) {
    return cb (new Error());
  }

  function create (task, opt, ctx){
    return function (cb) {
      task.call (scope, ctx, opt, cb);
    }
  }
  
  _.map(ops, function(op) {
    var task = scope[prefix + changeCase.pascalCase(op)];
    if (is.fn(task)) {
      tasks[op] = create (task, options, ctx);
    }
  });
  
  async.parallel(tasks, cb);
}