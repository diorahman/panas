var codes = require ("http").STATUS_CODES;
var changeCase = require ("change-case");

/**
 * `ApiError` error.
 *
 * @api private
 */
function ApiError(message, status, object) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "ApiError";
  this.status = status || 500;
  this.object = object || "Api"; 
  this.message = message;
}

/**
 * Inherit from `Error`.
 */
ApiError.prototype.__proto__ = Error.prototype;


function create(message, code){
  return function(object) { 
    return new ApiError(codes[code], parseInt(code), object);
  }    
}

/**
 * Expose `ApiError`.
 */
for (var code in codes) {
  if (parseInt(code) >= 400) {
    var method = changeCase.camelCase(codes[code]);
    module.exports[method] = create (codes[code], parseInt(code));
  }
}

/*

badRequest
unauthorized
paymentRequired
forbidden
notFound
methodNotAllowed
notAcceptable
proxyAuthenticationRequired
requestTimeOut
conflict
gone
lengthRequired
preconditionFailed
requestEntityTooLarge
requestUriTooLarge
unsupportedMediaType
requestedRangeNotSatisfiable
expectationFailed
iMATeapot
unprocessableEntity
locked
failedDependency
unorderedCollection
upgradeRequired
preconditionRequired
tooManyRequests
requestHeaderFieldsTooLarge
internalServerError
notImplemented
badGateway
serviceUnavailable
gatewayTimeOut
httpVersionNotSupported
variantAlsoNegotiates
insufficientStorage
bandwidthLimitExceeded
notExtended
networkAuthenticationRequired

*/