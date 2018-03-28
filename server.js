var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8090;
var bodyParser   = require('body-parser');
var path = require('path');
var routes = require('./controller/routes');
var config = require('./config/config');
var Web3 = require("web3");
//web3
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8081"));
var Account=require('./service/AccountManagement');
var BlockChain=require('./service/BlockChain');
BlockChain.web3=web3;
Account.web3=web3;
BlockChain.initialize();
Account.initialze();
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

app.use(bodyParser()); // get information from html forms
app.use('/', routes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// require('./controller/routes.js')(app);
app.listen(port);
console.log('The magic happens on port ' + port);