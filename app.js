/*
 * Requires and initialization.
 */

//Express
var express = require('express');
var app = express();
//MongoDB
var mongojs = require('mongojs');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';
var collections = ["users", "packages"];
var db = mongojs(mongoUri, collections);

/*
 * Listening Port
 */
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

/*
 * Application Logic
 */
app.get('/', function(request, response) {
  response.send('Hello World! And also Patrick');
});

app.post('/register', function(request, response) {
      
});


// MongoDB 
app.get('/createUser', function(request, response){
  var newPerson = {
        name: "Chae Jubb",
        age: "18"
  };
  db.users.save(newPerson);
});
