/*
 * Requires and initialization.
 */

//Express
var express = require('express');
var app = express();
//MongoDB
var mongo = require('mongojs');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';

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
