// var Web3 = require("web3");
var info;
var web3;
exports.initialze = function () {
    web3=module.exports.web3;
}

exports.createAccount = function (passPhrase, done) {
    info=web3.personal.newAccount(passPhrase);
    done(info)
}

exports.checkBalance = function (accountAddress, done) {
    info=web3.eth.getBalance(accountAddress);
    done(info);
}

exports.unlockAccount = function (accountAddress, passPhrase, done) {
    info=web3.personal.unlockAccount(accountAddress, passPhrase);
    done(info);
}