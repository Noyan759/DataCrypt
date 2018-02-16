var Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8081"));

var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);

var proof =proofContract.at("0xf16943e949d85c4034e41bed12f64b917f8235ec");

exports.storeFile = function (owner, fileHash, done) {
    var message;
    proof.set.sendTransaction(owner, fileHash, {
        from: web3.eth.accounts[0],
        }, function(error, transactionHash){
        if (!error)
            message = transactionHash;
        else
            message = "Error";
    })
    done(message);
} 

exports.getInfo = function (fileHash, done) {
    var info;
    info=proof.get.call(fileHash);
    done(info)
}