var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8090;
var bodyParser   = require('body-parser');
var path = require('path');
var routes = require('./controller/routes');
var config = require('./config/config');
var Web3 = require("web3");
//web3
var authConfig = require('./config/authConfig');
var jwt = require('jsonwebtoken');
var authMiddleware = require('./middlewares/authMiddleware');
var authenticate = require('./controller/authenticateController');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8081"));
var BCAccount=require('./service/BCAccountService');
var BlockChain=require('./service/BlockChain');
BlockChain.web3=web3;
BCAccount.web3=web3;
BlockChain.initialize();
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

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname));

/*db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  }
  else{
    console.log('Connected.')
  }
})*/
app.set('superSecret', authConfig.secret); // secret variable
authMiddleware.jwt=jwt;
authMiddleware.app=app;
authenticate.jwt=jwt;
authenticate.construct(bodyParser,app);

app.use(bodyParser()); // get information from html forms
app.use('/', routes);
app.use('/authenticate', authenticate.router);
app.use(authMiddleware);
app.get('/hello',function(req,res){
  res.send('hello back!');
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// require('./controller/routes.js')(app);
app.listen(port);
console.log('The magic happens on port ' + port);