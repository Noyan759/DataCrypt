var express  = require('express');
var app      = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);
exports.io=io;
var port     = process.env.PORT || 8090;
var bodyParser   = require('body-parser');
var path = require('path');
var routes = require('./controller/routes');
var config = require('./config/config');
var Web3 = require("web3");
//web3
var jwt = require('jsonwebtoken');
var authMiddleware = require('./middlewares/authMiddleware');
var authenticate = require('./controller/authenticateController');
var DCAccountController = require('./controller/DCAccountController');
var authConfig = require('./config/authConfig');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8081"));
var BCAccount=require('./service/BCAccountService');
var BlockChain=require('./service/BlockChain');
var DCAccount = require('./service/DCAccountService');
BlockChain.io=io;
routes.io=io;
BlockChain.web3=web3;
DCAccount.web3=web3;
BCAccount.web3=web3;
BlockChain.initialize();
DCAccount.initialize();
BCAccount.initialze();
//var db = require('./config/db.js');
var hbs = require('hbs');
hbs.registerHelper('if_equal', function(a, b, opts) {
  if (a == b) {
      return opts.fn(this)
  } else {
      return opts.inverse(this)
  }
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname));

app.set('superSecret', authConfig.secret); // secret variable
authMiddleware.jwt=jwt;
authMiddleware.app=app;
authenticate.jwt=jwt;
authenticate.construct(bodyParser,app);

app.use(bodyParser()); // get information from html forms
app.post('/user/createUser',function(req,res){
  console.log(req);
  DCAccount.createAccount(req.body,function(info){
      res.json(info);
  })
});
app.use('/authenticate', authenticate.router);
app.use(authMiddleware);


app.use('/user', DCAccountController);
app.use('/', routes);
app.get('/hello',function(req,res){
  res.send('hello back!');
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.listen(port);
server.listen(port);
console.log('The magic happens on port ' + port);