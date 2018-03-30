var DCAccountModel = require('../models/DCAccountModel');
var BCAccountService = require('./BCAccountService');
var bcrypt = require ('bcrypt');
const saltRounds = 10;
var info={};
var details;
exports.createAccount = function(data, done) {
    BCAccountService.createAccount(data.password, function (address) {
        if(address.status==false){
            done(address);
        }
        else{
            data.address=address.message;
            data.privateKey=null;
            console.log(data);
            bcrypt.hash(data.password, saltRounds).then(function(hash) {
                // Store hash in your password DB.
                data.password=hash;

                DCAccountModel.createAccount(data, function (info) {
                    console.log("createAccount response: "+info);
                    done(info);
                })
            });
        }
    });
}

exports.getByUsername = function (data, done) {
    DCAccountModel.getByUsername(data, function(info) {
        console.log("getByUsername response: "+info);
        done(info);
    })
}

exports.getAllAccounts = function (data, done) {
    DCAccountModel.getAllAccounts(data, function(info) {
        console.log("getAllAccounts response: "+info);
        done(info);
    })
}

exports.updateAccount = function (data, done) {
    DCAccountModel.updateAccount(data, function(info) {
        console.log("updateAccount response: "+info);
        done(info);
    })
}

exports.deleteAccount = function (data, done) {
    DCAccountModel.deleteDCAccount(data, function(info) {
        console.log("deleteAccount response: "+info);
        done(info);
    })
}

exports.checkBalance = function (data, done) {
    DCAccountModel.getByUsername(data, function (res) {
        console.log('userdetails: '+res.user);
        if(!(res.message)){
            info.message='User not found';
            console.log(info.message);
            info.status=false;
            done(info);
        }
        else{
            BCAccountService.checkBalance(res.user.address, function(info) {
                done(info);
            })
        }
    })
}

exports.unlockAccount = function (data, done) {
    DCAccountModel.getByUsername(data, function (res) {
        console.log('userdetails: '+res.message);
        if(!(res.message)){
            info.message='User not found';
            console.log(info.message);
            info.status=false;
            done(info);
        }
        else{
            BCAccountService.unlockAccount(res.user.address, data.password, function(info) {
                done(info);
            })
        }
    })
}