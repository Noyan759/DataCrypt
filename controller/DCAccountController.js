var DCAccount=require('../service/DCAccountService');
var BCAccount=require('../service/BCAccountService');
var app = require('express');
var router = app.Router()

    router.get('/test', function(req, res) {
        res.render('Test', {});
    });
    router.post('/getByUsername',function(req,res){
        console.log(req);
        DCAccount.getByUsername(req.body,function(info){
            res.json(info);
        })
    });
    router.post('/updateAccount',function(req,res){
        console.log(req);
        DCAccount.updateAccount(req.body,function(info){
            res.json(info);
        })
    });
    router.post('/deleteAccount',function(req,res){
        console.log(req);
        DCAccount.deleteAccount(req.body,function(info){
            res.json(info);
        })
    });
    router.get('/deleteAllAccount',function(req,res){
        console.log(req);
        DCAccount.deleteAllAccount(function(info){
            res.json(info);
        })
    });
    router.post('/checkBalance',function(req,res){
        console.log(req);
        DCAccount.checkBalance(req.body,function(info){
            res.json(info);
        })
    });
    router.post('/unlockAccount',function(req,res){
        console.log(req);
        DCAccount.unlockAccount(req.body,function(info){
            res.json(info);
        })
    });
    router.post('/sendEther',function(req,res){
        console.log(req);
        DCAccount.sendEther(req.body.ac1, req.body.ac1password, req.body.ac2, req.body.ether, function(info){
            res.json(info);
        })
    });

module.exports = router;