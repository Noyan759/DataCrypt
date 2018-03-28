// var Web3 = require("web3");
var HookedWeb3Provider = require("hooked-web3-provider");
var EthereumTx = require('ethereumjs-tx');
var bufferFrom = require('buffer-from')
var keythereum = require("keythereum");
var Account=require('./BCAccountManagement');

var web3;

//Private key extraction
var keydir = "F:/8th_Semester/SYP-II/Externalkeystore";
var address = "70531c747a4a62f3198a8abb13b57c3b50126b54";
var keyObject = keythereum.importFromFile(address, keydir);
var pvtKey = keythereum.recover("account1", keyObject);
// var pvtKeyString = "0x"+pvtKey.toString('hex')+"";
// console.log("keyObject: \n" +keyObject+"\nprivateKey: "+pvtKey.toString('hex'));

//Transaction signing
var provider = new HookedWeb3Provider({
        host: "http://localhost:8081",
        transaction_signer: {
            hasAddress: function(address, callback){
                callback(null, true);
            },
            signTransaction: function(tx_params, callback){
                var rawTx = {
                gasPrice: web3.toHex(tx_params.gasPrice),
                gasLimit: web3.toHex(tx_params.gas),
                // value: web3.toHex(tx_params.value),
                from: tx_params.from,
                //to: tx_params.to,
                nonce: web3.toHex(tx_params.nonce)
                };
                var privateKey = bufferFrom(pvtKey, 'hex');
                var tx = new EthereumTx(rawTx);
                tx.sign(privateKey);
                callback(null, '0x'+tx.serialize().toString('hex'));
            }
        }
});

// var web3 = new Web3(provider);

// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8081"));
// Account.web3=web3;
var proof;
exports.initialize = function () {
    web3=exports.web3
    var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);

    proof =proofContract.at("0xf16943e949d85c4034e41bed12f64b917f8235ec");
}
// var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);

// var proof =proofContract.at("0xf16943e949d85c4034e41bed12f64b917f8235ec");

exports.storeFile = function (owner, fileHash, done) {
    var message;
    web3.personal.unlockAccount(web3.eth.accounts[0], "paccount0");
    proof.set.sendTransaction(
        owner,
        fileHash, 
        {
            from: web3.eth.accounts[0],
            gasPrice: "20000000000",
            gas: "200000",
        }, 
        function(error, transactionHash)
        {
            if (error){
                message={tHash: "", note: error};
                console.log('Error: '+error);
            }
            else{
                message={tHash: transactionHash, note: "submitted"};
                console.log('Transaction Hash: '+message.tHash);
            }
            done(message);
        }
    )
    // done(message);
} 

exports.getInfo = function (fileHash, done) {
    var info;
    Account.checkBalance(web3.eth.accounts[0], function (info) {
        console.log("info:"+info);
    });
    info=proof.get.call(fileHash);
    done(info)
}