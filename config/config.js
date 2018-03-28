const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/DataCrypt_Databsse", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

exports.mongoose=mongoose;
