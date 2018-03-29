var mongoose = require("../config/config").mongoose;

const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
 
const USER_INFO = new Schema({
 id: ObjectId,
 username: String,
 password: String,
 email: string,
 address: String,
 privatekey: String
});

var User = mongoose.model('user', USER_INFO);

exports.createAccount = function (data, done) {
    var person = new User({
        username: data.username,
        password: data.password,
        email: data.email,
        address: data.address,
        privatekey: data.privatekey
      });
    person.save(function(err){
        if(err)
            throw err;
        info='User saved successfully!';
        console.log(info);
        done(info);
    })
    // done(info)
}

exports.getAllAccounts = function(done) {
    // get all the users
    User.find({}, function(err, users) {
        if (err) throw err;
    
        // object of all the users
        console.log(users);
        done(users);
    });
}

exports.getByUsername = function (data, done) {
    User.find({ username: data.username }, function(err, user) {
        if (err) throw err;
      
        // object of the user
        console.log(user);
        done(user);
    });
}

exports.updateAccount = function (data, done) {
    User.findOneAndUpdate({ username: data.username }, data , function(err, user) {
        if (err) throw err;
      
        // we have the updated user returned to us
        console.log(user);
        done(user);
    });
}

exports.deleteDCAccount = function (data, done) {
    User.findOneAndRemove({ username: data.username }, function(err) {
        if (err) throw err;
        
        // we have deleted the user
        info='User deleted!';
        console.log(info);
        done(info);
    });
}