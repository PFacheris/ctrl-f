/*
 * Requires and initialization.
 */

//Express
var express = require('express');
var app = express();

// other modules
var users = require('./routes/users');

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


// user actions: references
app.get('/routes/:firstName:lastName:email', users.createUser);
