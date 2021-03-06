var mongoose = require("../config/config").mongoose;

const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
 
const USER_INFO = new Schema({
 id: ObjectId,
 username: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 email: String,
 address: String,
 privatekey: String
});

var User = mongoose.model('user', USER_INFO);
var info={};
exports.createAccount = function (data, done) {
    var person = new User({
        username: data.username,
        password: data.password,
        email: data.email,
        address: data.address,
        privatekey: data.privatekey
      });
    person.save(function(err){
        if(err){
            info.status=false;
            info.message=err;
            console.log('Creating err ');
        }
        else{
            info.status=true;
            info.message={publicAddress: data.address};
        }
        // console.log(info);
        done(info);
    })
}

exports.getAllAccounts = function(done) {
    // get all the users
    User.find({}, function(err, users) {
        if (err){
            info.status=false;
            throw err;
        } 
    
        // object of all the users
        console.log(users);
        info.status=true;
        info.message=users
        done(info);
    });
}

exports.getByUsername = function (data, done) {
    User.findOne({ username: data.username }, function(err, user) {
        if (err){
            throw err;
            info.status=false;
        }
        else if (!user)
            info.status=false;
        else
            info.status=true;      
        // object of the user
        console.log('getByUsername: '+user);
        info.message=user; 
        done(info);
    });
}

exports.updateAccount = function (data, done) {
    User.findOneAndUpdate({ username: data.username }, data , function(err, user) {
        if (err){
            info.status=false;
            throw err;
        }       
        // we have the updated user returned to us
        console.log(user);
        info.status=true;
        info.message=user
        done(info);
    });
}

exports.deleteDCAccount = function (data, done) {
    User.findOneAndRemove({ username: data.username }, function(err) {
        if (err){
            info.message="Error!";
            info.status=false;
            throw err;
        }        
        // we have deleted the user
        info.message="Deleted!";
        info.status=true;
        console.log(info);
        done(info);
    });
}

exports.deleteAllDCAccount = function (done) {
    User.deleteMany({}, function(err) {
        if (err){
            info.message="Error!";
            info.status=false;
            throw err;
        }        
        // we have deleted the user
        info.message="Deleted!";
        info.status=true;
        console.log(info);
        done(info);
    });
}