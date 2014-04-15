var thunkify = require ("thunkify");

function upload (gfs, gfsOpt, part, cb) {
  var writeStream = gfs.createWriteStream(gfsOpt);
  writeStream.on ("error", cb);
  writeStream.on ("close", function (file){
    cb (null, file);
  });
  part.pipe (writeStream);
}

module.exports = thunkify(upload);