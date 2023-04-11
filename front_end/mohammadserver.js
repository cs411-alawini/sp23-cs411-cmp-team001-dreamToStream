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
const { response } = require('express');
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
  res.render('index', { title: 'Home' });
});

/* GET create user page, respond by rendering create-user.ejs */
app.get('/create-user', function(req, res) {
  res.render('create-user', { title: 'Create User' });
});

/* POST request to create user, redirect to success page if successful, show error message if unsuccessful */
app.post('/create-user', function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var dob = req.body.dob;
  var country = req.body.country;

  connection.query('SELECT MAX(id) AS max_id FROM Users', function(err, result) {
    if (err) {
      res.send(err);
      return;
    }

    // Get the next id to create a new user
    var max_id = result[0].max_id;
    var next_id = max_id ? max_id + 1 : 1;

    var sql = `INSERT INTO Users VALUES (${next_id}, '${firstName}', '${lastName}', '${dob}', '${country}')`;
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
      console.log('New user inserted with id: ' + next_id);
      res.redirect('/success');
    });
  });
});


/* GET success page, respond by rendering success.ejs */
app.get('/success', function(req, res) {
  res.render('success', { title: 'Success' });
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});


app.get('/rating', function(req, res) {
  res.render('rating', { title: 'Add a Rating' });
});

app.get('/shows', function(req, res) {
  res.render('shows', { title: 'Shows' });
});

app.get('/AdvQuery1Table', function(req, res) {
  res.render('AdvQuery1Table', { title: 'Query1' });
});

app.get('/search', (req, res) => {
    var title = req.query.title
    var genre = req.query.genre;
  
    let sql = `SELECT * FROM Shows WHERE  (name like '${title}%' OR name like '${title}%') AND genre LIKE '%${genre}%' LIMIT 15`
    // let sql = `SELECT * FROM Shows LIMIT 15`
  
      connection.query(sql, (err, result) => {
        if (err) {
          res.send(err);
          return;
        }
        // res.render('shows', { title: 'Shows' });
        // res.re(result)
        res.send(result)
      });
    });
  
/* POST request to create user, redirect to success page if successful, show error message if unsuccessful */
app.post('/rating', function(req, res) {
  var media = req.body.media;
  var rating = req.body.rating;
  var type = req.body.type;

  if (type = 'Movie'){
    var sql2 = `UPDATE MovieRating SET value = ${rating} WHERE name = '${media}'`;


  }
  else {
    var sql2 = `UPDATE ShowRating SET value = ${rating} WHERE name = '${media}'`;

  }

    connection.query(sql2, function(err, result) {
      if (err) {
        res.send(err);
        return;
      }
      console.log('Rating Updated');
      res.redirect('/success');
    });
  });



app.get('/topMovies', function(req, res){
    var genre = req.query.genre;
    var sYear = req.query.sYear;
    var eYear = req.query.eYear;

    let sql = `SELECT name, releaseYear, value 
    FROM Movies as m Natural JOIN MovieRating as mr JOIN (
      SELECT MAX(value) as mxs, releaseYear
      FROM Movies Natural JOIN Movie Rating
      GROUP by releaseYear
    ) as maxs ON maxs.releaseYear=m.releaseYear
    WHERE genre LIKE '%${genre}%' and mr.value=maxs.mxs
    ORDER BY name
    LIMIT 15`

    var sql1 = `SELECT name, releaseYear, value 
    FROM Movies as m Natural JOIN MovieRating
    WHERE genre LIKE '%${genre}%'
    ORDER BY name
    LIMIT 15`

    connection.query(sql1, (err, result) => {
      if (err) {
        res.send(err);
        return;
      }
      // res.render('shows', { title: 'Shows' });
      // res.re(result)
      res.send(result)
    });

  });


// var express = require('express');
// var bodyParser = require('body-parser');
// var mysql = require('mysql2');
// var path = require('path');
// var connection = mysql.createConnection({
//                 host: '35.226.99.157',
//                 user: 'root',
//                 password: 'dreamToStream',
//                 database: 'dreamToStream'
// });

// connection.connect;


// var app = express();

// // set up ejs view engine 
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
 
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(__dirname + '../public'));

// /* GET home page, respond by rendering index.ejs */
// app.get('/', function(req, res) {
//   res.render('index', { title: 'Create User' });
// });

// app.get('/success', function(req, res) {
//       res.send({'message': 'User created successfully!'});
// });
 
// // this code is executed when a user clicks the form submit button
// app.post('/mark', function(req, res) {
//   var firstName = req.body.firstName;
//   var lastName = req.body.lastName;
//   var dob = req.body.dateOfBirth;
//   var country = req.body.country;

//   connection.query('SELECT MAX(id) AS max_id FROM Users', function(err, result) {
//     if (err) {
//       res.send(err);
//       return;
//     }

//     // Get the next id to create a new user
//     var max_id = result[0].max_id;
//     var next_id = max_id ? max_id + 1 : 1;

//     var sql = `INSERT INTO Users VALUES (${next_id}, '${firstName}', '${lastName}', '${dob}', '${country}')`;
//     connection.query(sql, function(err, result) {
//       if (err) {
//         res.send(err);
//         return;
//       }
//       console.log('New user inserted with id: ' + next_id);
//       res.redirect('/success');
//     });
//   });
// });

// // create a new route to execute SELECT query
// app.get('/shows', function(req, res) {
//   var sql = 'SELECT * FROM Shows LIMIT 15';

//   connection.query(sql, function(err, results, fields) {
//     if (err) {
//       console.error('Error executing MySQL query: ' + err.stack);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     // render shows.ejs file with query results
//     res.render('shows', { shows: results });
//   });
// });



// app.listen(80, function () {
//     console.log('Node app is running on port 80');
// });
