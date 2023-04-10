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

// Create a new GET route for the sign-in page
app.get('/sign-in', function(req, res) {
  res.render('sign-in', { title: 'Sign In' });
});

// Handle sign-in form submissions
app.post('/sign-in', function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  connection.query(`SELECT * FROM Users WHERE firstName='${firstName}' AND lastName='${lastName}'`, function(err, results, fields) {
    if (err) {
      res.send(err);
      return;
    }

    if (results.length > 0) {
      res.render('signinsuccess', { users: results });
    } else {
      res.render('sign-in', { title: 'Sign In', error: 'Invalid credentials' });
    }
  });
});

// Handle sign in to homepage for users based on their given id
app.get('/home/:id', function(req, res) {
  var userId = req.params.id;
  // Fetch user data based on the userId from the database
  connection.query('SELECT * FROM Users WHERE id = ?', [userId], function(err, results) {
    if (err) {
      res.send(err);
      return;
    }
    // Render the home page with the user data
    res.render('home', { user: results[0] });
  });
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

/* GET success page, respond by rendering success.ejs */
app.get('/success', function(req, res) {
  res.render('success', { title: 'Success' });
});

app.get('/rating', function(req, res) {
  res.render('rating', { title: 'Add a Rating' });
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
 
  //GET request for shows
  app.get('/shows', function(req, res) {
    res.render('shows', { title: 'Shows' });
  });
  
  //GET request for search
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

//Generated Data for Advanced Queries -- REPLACE with sql outputs
var dataQuery1 = [
  ["Shows",'2021','23'],
  ["Movies ",'2021','432'],
  ["Shows",'2020','98'],
  ['Movies','2020','435']
  ]; 

var dataQuery2 = [
  ["Divya",'Manirajan','23','11-02-1999'],
  ["John ",'Smith','43','1-04-1949'],
  ["boe",'jonnson','98','3-0-3333'],
  ['hadf','adsf','435','2-2-2220']
  ]; 


//GET request to set up advanced queries
  app.get('/AdvQueriesSubmit', function(req,res){
    res.render('AdvQueriesSubmit');
  });

//POST request for Advanced Query 1
  app.post('/Query1', function(req, res) {
    res.render('AdvQuery1Table', {sampleData:dataQuery1})}
  );  

  //POST request for Advanced Query 2
app.post('/Query2', function(req, res) {
  res.render('AdvQuery2Table', {sampleData:dataQuery2})}
  ); 



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
