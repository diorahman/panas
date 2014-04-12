var mongoose = require ("mongoose");
var Grid = require ("gridfs-stream");
var plug = require ("./plug");

var connection;

function connect (options, app, scope) {
  
  var driver = options.driver;

  return function (cb) {
    
    connection = driver.connection;

    driver.connect (options.db);
    driver.connection.on("open", function(){
      // todo: setting the gridfs, set collection name etc (namespacing)
      plug (app, "gfs", Grid (connection.db, driver.mongo));
      
      if (cb) { cb();}
      
    });

    return scope.mount;
  }
}

function close (options) {
  return function (cb) {
    if (!connection) return cb();
    connection.close(cb);
  }
}

module.exports = {
  connect : connect,
  close : close
}
