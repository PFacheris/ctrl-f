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
  'mongodb://ctrl-f.herokuapps.com/mydb';
var collections = ["users", "packages"];
var db = mongojs(mongoUri, collections);

var url = require('url');

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
  var name, age
  var queryData = url.parse(request.url, true).query;
  
  if (queryData.name) {
    name = queryData.name;
  } else {
    name = null;
  }

  if (queryData.age) {
    age = queryData.name;
  } else {
    age = null;
  }

  var newPerson = {
        name: name,
        age: age
  };
  db.users.save(newPerson);
});

app.get('/listUsers', function(request, response){
  db.users.find()
});
