var Web3=require('../service/BlockChain');
var app = require('express');
var io = require('../server').io;
var router = app.Router()
    router.get('/test', function(req, res) { 
        io.send('heyalablabla');
        res.json({message: 'sent'});
    });

    router.get('/', function (req, res) {
        res.render('Home', {});
    });
    router.get('/addFile', function (req, res) {
        res.render('AddFile', {});
    });
    router.get("/verifyFile", function(req, res){
        res.render('VerifyFile', { message: "" });
    });
    router.post("/verifyFile", function(req, res){ 
        console.log("\nhash: "+req.body.hash);

        Web3.getInfo(req.body.hash, function (info) {
            console.log(info);
            if(info[1]==="")
                res.json({message: "File not found", status: false });
            else{
                var d=new Date(info[0].c*1000);
                console.log("Date: "+d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear());
                // res.render('VerifyFile', { message: {owner: info[1], timestamp: d} });
                res.json({ message: {owner: info[1], timestamp: 'Date: '+d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()}, status: true });
            }
        })
    });
    router.post("/addFile", function(req, res){  
        
        Web3.storeFile(req.body, function (info) {
            console.log(info);
            // res.render('AddFile', { message: info });
            res.json(info);
        })
    });
    router.post("/addMultipleFiles", function(req, res){  
        
        Web3.storeMultipleFiles(req.body, function (info) {
            console.log(info);
            // res.render('AddFile', { message: info });
            res.json(info);
        })
    });
module.exports = router;