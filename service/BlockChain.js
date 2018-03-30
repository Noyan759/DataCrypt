// var Web3 = require("web3");
var HookedWeb3Provider = require("hooked-web3-provider");
var EthereumTx = require('ethereumjs-tx');
var bufferFrom = require('buffer-from')
var keythereum = require("keythereum");
var BCAccount=require('./BCAccountService');
var DCAccount=require('./DCAccountService');
// var io = require('socket.io');
var web3, io;

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
var ws,stompClient;
initializeWebSocketConnection = function() {
    ws = new SockJS('http://192.168.210.108:9000/socket');

    // var client = sjsc.create("http://192.168.210.108:9000/socket");
    // client.on('connection', function () { 
    //     // connection is established
    //     console.log('connected');
    // });
    // client.on('data', function (msg) { 
    //     // received some data
    //     console.log('Received message: '+msg); 
    // });
    // client.on('error', function (e) { 
    //     // something went wrong 
    //     console.log('error: '+e);
    // });
    // client.write("testingtesgintesting");

    stompClient = Stomp.over(ws);
    console.log('connecting');
    stompClient.connect({}, function(frame) {
      console.log('subscribing');
      stompClient.subscribe('/chat', (message) => {
        console.log('checking')
        if (message.body) {
          console.log('Received message: '+message.body);
        }
        stompClient.send('/app/send/message' , {}, 'result');
      });
    });
    console.log("cannot connect");

}

var proof;
exports.initialize = function () {
    web3=exports.web3;
    io=exports.io;
    var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);

    proof =proofContract.at("0xf16943e949d85c4034e41bed12f64b917f8235ec");
    // console.log('Calling initializeWebSockeConnection');
    // initializeWebSocketConnection();
    // console.log('Returned from initializeWebSockeConnection');
    console.log('Initialize io: '+io);
    io.send('hello world!');
    proof.logFileAddedStatus().watch(function(error, result){
        if(!error) {
            if(result.args.status == true) {
                io.send(result);
            }
        }
    })
}
// var proofContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}]);

// var proof =proofContract.at("0xf16943e949d85c4034e41bed12f64b917f8235ec");
var info=null;
exports.storeFile = function (data, done) {
    var message;
    DCAccount.getByUsername(data, function (userDetails) {
        BCAccount.unlockAccount(userDetails.user.address, data.password, function (info) {
            // console.log("info:");
            // console.log(info.res);
            if(!(info.response))
                done({message: 'File cannot be submitted.'})
            else{
                proof.set.sendTransaction(
                    userDetails.user.address,
                    data.hash, 
                    {
                        from: userDetails.user.address,
                        gasPrice: "20000000000",
                        gas: "200000",
                    }, 
                    function(error, transactionHash)
                    {
                        if (error){
                            message={tHash: "", note: error, status: false};
                            console.log('Error: '+error);
                        }
                        else{
                            message={tHash: transactionHash, note: "submitted", status: true};
                            console.log('Transaction Hash: '+message.tHash);
                        }
                        done(message);
                    }
                )
            }
        });
    })
    
    
    // done(message);
} 

exports.getInfo = function (fileHash, done) {
    try{
        info=proof.get.call(fileHash);
    }
    catch(err){
        console.log('Caught error: '+err);
    }
    
    done(info)
}