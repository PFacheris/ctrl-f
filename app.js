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
app.use(express.bodyParser());
 
app.get('/', function(request, response) {
  response.send('Hello World! And also Patrick');
});


// user actions: references
<<<<<<< HEAD
app.get('/createUser', users.createUser);
app.get('/users', users.listUsers);
app.delete('/users/:id', users.deleteUser);
=======
app.post('/user/new', users.createUser);
>>>>>>> 378bb01b8c262e0876cb0d456b2357210309192a
