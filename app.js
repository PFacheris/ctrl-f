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

<<<<<<< HEAD
/*
 * Listening Port
 */
=======
app.get('/', function(request, response) {
  response.send('Hello World! And also Patrick');
});

>>>>>>> 6e54b327e11f4f6b94d6298d5553ff761bf99a76
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
<<<<<<< HEAD

/*
 * Application Logic
 */
app.post('/register', function(request, response) {
      
});
=======
>>>>>>> 6e54b327e11f4f6b94d6298d5553ff761bf99a76
