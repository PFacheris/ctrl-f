/*
 * Requires and initialization.
 */

//Dependencies
var express = require("express"),
    path = require("path"),
    user = require('./routes/users');

var app = express();

var application_root = __dirname;

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
app.configure(function () {
  app.set('title', 'ctrl-f API');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
 
app.get('/api', function(request, response) {
  response.send('ctrl-f API is running.');
});


// User Actions
app.post('/user/new', user.create);
app.put('/user/:id', user.update);
app.get('/users', user.getAll);
app.get('/user/:id', user.getByID);
app.get('/user/:email', user.getByEmail);
app.delete('/user/:id', user.destroy);
