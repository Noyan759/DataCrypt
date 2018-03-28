var mongoose = require("../config/config").mongoose;

const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
 
const USER_INFO = new Schema({
 id: ObjectId,
 username: String,
 password: String,
 address: String,
 privatekey: String
});

var user = mongoose.model('user', USER_INFO);

exports.createDCAccount = function (data, done) {
    info=user.
    done(info)
}