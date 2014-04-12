var request = require ("supertest").agent;
var resources = "../../resources";

// bootstrap
var user = require (resources + "/user/fixtures");

// api related options/policy
var index = __dirname + "/../..";
var options = {
  root : index + "/endpoints", // the app index
  db : "mongodb://localhost/test", // the db uri
  driver : require ("mongoose") // the driver
}

var app = require(index)(options);
var toServer = function (){ return app.listen() }

before (user.bootstrap());

describe ("Users", function (){

  it ("Should find users", function (done){

    var uri = "/api/1/users"
    request (toServer())
    .get (uri)
    .expect (200)
    .end (function (err, res) {
      res.body.length.should.be.above(0);
      done(err);
    });
  });
  
});



