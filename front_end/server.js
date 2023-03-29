/*
// THIS IS ALL OLD STUFF FROM THE TUTORIAL IN CLASS
// Importing the packages and assigning them to variables. Similar to include
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');


// Initializing the application
var app = express();

// Write properties to define how server behaves when user interacts with it
// '/' is the base path
app.get('/', function(req, res) {
        res.send({'message': 'Hello'});
});

// Provide port number that the app will listen on
app.listen(80, function () {
    console.log('Node app is running on port 80');
});
*/


var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '35.226.99.157',
                user: 'root',
                password: 'dreamToStream',
                database: 'dreamToStream'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;

  var sql = `INSERT INTO Users VALUES (16, '${netid}', 'TestLast', '1996-03-18', 'United States')`;

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});



app.listen(80, function () {
    console.log('Node app is running on port 80');
});
