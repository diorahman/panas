module.exports = function plug (api, name, obj, replace) {
  if (replace) {
    api.middleware.splice(0, 1);
  }
  var plugin = function * (next){
    this[name] = obj;
    yield next;
  }
  api.middleware.unshift(plugin);
}