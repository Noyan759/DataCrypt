var DCAccountModel = require('../models/DCAccountModel');
var BCAccountService = require('./BCAccountService');
var bcrypt = require ('bcrypt');
const saltRounds = 10;

var details;
exports.createAccount = function(data, done) {
    console.log(data);
    BCAccountService.createAccount(data.password, function (address) {
        data.address=address;
        data.privateKey=null;
        console.log('check 1');
        console.log(data);
        bcrypt.hash(data.password, saltRounds).then(function(hash) {
            // Store hash in your password DB.
            data.password=hash;
            console.log('check 2');

            DCAccountModel.createAccount(data, function (info) {
                console.log('check 3');

                console.log("createAccount response: "+info);
                done(info);
            })
        });
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
    DCAccountModel.getByUsername(data, function (userDetails) {
        BCAccountService.checkBalance(userDetails.address, function(balance) {
            done(balance);
        })
    })
}

exports.unlockAccount = function (data, done) {
    DCAccountModel.getByUsername(data, function (userDetails) {
        BCAccountService.unlockAccount(userDetails.address, data.password, function(balance) {
            done(balance);
        })
    })
}