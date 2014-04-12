var bootstrap = require ("./bootstrap");

var mongoose = require ("mongoose");
mongoose.connect ("mongodb://localhost/api-test");

// todo test
// DEBUG=* node resources/structure/title/fixtures/test
bootstrap()(function(){
  console.log ("done");
  mongoose.disconnect();
});