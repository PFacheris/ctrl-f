// loading database
var mongodb = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';
var collections = ["users", "packages"];
var db = mongojs(mongoUri, collections);

var url = require('url');



// create new user
users.createUser = function(request, response) {
  var firstName, lastName, email
  
  if (request.params.firstName) {
    firstName = request.params.firstName;
  } else {
    name = null;
  }

  if (request.params.lastName) {
    lastName = request.params.lastName;
  } else {
    lastName = null;
  }

  if (request.params.email) {
    email = request.params.email;
  } else {
    email = null;
  }

  var newPerson = {
        name: {firstName: firstName, lastName: lastName},
        email: email
  };
  db.users.save(newPerson);
});

/* app.get('/listUsers', function(request, response){
  db.users.find()
}); */
