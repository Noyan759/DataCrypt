// var Web3 = require("web3");
var info={};
var web3;
exports.initialze = function () {
    web3=module.exports.web3;
}

exports.createAccount = function (passPhrase, done) {
    web3.personal.newAccount(passPhrase, function(err, res){
        console.log('res: '+res);
        if(err || typeof res === 'undefined' || !res || res===undefined){
            info.status=false;
            info.message=err;
        }
        else{
            info.status=true;
            info.message=res;
        }
        done(info);
    });
}

exports.checkBalance = function (accountAddress, done) {
    console.log('accoountAddress: '+accountAddress)
    web3.eth.getBalance(accountAddress, function(err, res){
        if(err)
            info.status=false;
        else
            info.status=true;
        info.message=res;
        done(info);
    });
}

exports.unlockAccount = function (accountAddress, passPhrase, done) {
    web3.personal.unlockAccount(accountAddress, passPhrase, function(err, res){
        if(err || !res)
            info.status=false;
        else
            info.status=true;
        info.message=res;
        done(info);
    });
}

exports.sendEther = function (ac1, ac2, ether, done) {
    web3.eth.sendTransaction({from: ac1, to: ac2, value: web3.toWei(ether, "ether")}, function (err, details) {
        if(err || !details)
            info.status=false;
        else{
            console.log('Ether sent\n\n');
            info.status=true;
        }
        info.message=details;
        console.log('inside sendign ether');
        console.log(info)
        done(info);
    })
}