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
exports.bla = function (data,done)
{
    user.create({username : data.username,
        password: data.password
    },
    function (err, small) {
        if (err) return console.error(err);
            console.log("New user inserted into db");
        }
    )
}
exports.getByEmail = function (data,done) {
    user.findOne({'username': data}, function (err,res) {
        if (err) console.error(err);

        console.log("data  ",data)

        console.log("res  ",res)
        done(res);
    })
}