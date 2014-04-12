// require ("panas").helper;
var helper = require ("../../../../").helper;
var Router = helper.Router;

module.exports = Routes;

function Routes (name, mid, handle) {
    
  // Create a router object with namespace `name` and middleware `mid`
  var router = new Router(name, mid);
  
  // users
  router.GET ("/users", handle.find);
  
  // return the router;
  return router;
}

