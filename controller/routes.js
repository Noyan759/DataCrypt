var Web3=require('../service/BlockChain');
var app = require('express');
var router = app.Router()


    router.get('/', function (req, res) {
        res.render('home', {});
        
    });
    router.get('/addFile', function (req, res) {
        res.render('AddFile', {});
        
    });
    router.get("/verifyFile", function(req, res){
        res.render('VerifyFile', { message: "FileHash is undefined" });
    });
    router.post("/verifyFile", function(req, res){ 
        console.log("\nhash: "+req.body.hash);

        if(req.body.hash===undefined)
            res.render('VerifyFile', { message: "FileHash is undefined" });
        var fileHash = req.body.hash;
        Web3.getInfo(req.body.hash, function (info) {
            res.render('VerifyFile', { message: info });
        })
    });
    router.post("/addFile", function(req, res){  
        console.log("\nowner: " + req.body.owner + "\nhash: " + req.body.hash);
        
        if(req.body.owner===undefined || req.body.hash===undefined)
            res.render('AddFile', { message: "Owner/FileHash is undefined" });
        
        Web3.storeFile(req.body.owner, req.body.hash, function (message) {
            res.render('home', { message: message });
        })
    });

module.exports = router;