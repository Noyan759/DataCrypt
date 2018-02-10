//var studentdetail=require('../models/studentDetail');

module.exports = function (app) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function (req, res) {
        res.render('home',{});
        
    });
    app.get('/studentform', function (req, res) {
        res.render('studentform',{});
        
    });
    app.get("/submit", function(req, res){
        var fileHash = req.body.hash;
        var owner = req.body.owner;
        proof.set.sendTransaction(owner, fileHash, {
        from: web3.eth.accounts[0],
        }, function(error, transactionHash){
        if (!error)
        {
        res.send(transactionHash);
        }
        else
        {
        res.send("Error");
        }
        })
    });
    app.get("/getInfo", function(req, res){
        var fileHash = req.body.hash;
        var details = proof.get.call(fileHash);
        res.send(details);
    });
    app.post('/studentdetail', function (req, res) {
        console.log(req.body);
        studentdetail.addNewStudent(req.body, function(info){

            res.render('home',{});

        });

    });
    app.post('/studentbyreg', function (req, res) {
        console.log(req.body);
        studentdetail.getStudentById(req.body.regno, function(info){

            res.render('studentbyreg',{"data" : info});

        });

    });
}