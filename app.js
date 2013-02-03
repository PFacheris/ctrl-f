/*
 * Requires and initialization.
 */

//Dependencies
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    users = require('./routes/users');

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
app.get('/users', users.listUsers);
app.get('/user/:id', users.listUsers);
app.post('/user/new', users.createUser);
app.delete('/user/:id', users.deleteUser);
