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
        }
        else
            info.status=true;
        info.response=res;
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
        info.response=res;
        done(info);
    });
}

exports.unlockAccount = function (accountAddress, passPhrase, done) {
    web3.personal.unlockAccount(accountAddress, passPhrase, function(err, res){
        if(err || !res)
            info.status=false;
        else
            info.status=true;
        info.response=res;
        done(info);
    });
}