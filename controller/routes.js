var Web3=require('../service/BlockChain');
var app = require('express');
var router = app.Router()


    router.get('/', function (req, res) {
        res.render('home', {});
        
    });
    router.post("/submit", function(req, res){        
        Web3.storeFile(req.body.owner, req.body.hash, function (message) {
            res.render('home', { message: message });
        })
    });
    router.get("/getInfo", function(req, res){
        var fileHash = req.body.hash;
        Web3.getInfo(req.body.hash, function (info) {
            res.render('fileinfo', { message: info });
        })
    });

module.exports = router;