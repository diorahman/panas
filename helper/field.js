var qs = require ("qs");
var util = require ("util");

module.exports = function (arr) {
  if (Array.isArray(arr) && arr.length >= 2) {
    return field = (qs.parse(arr[0] + "=" + arr[1]));
  } else {
    return {};
  }
}