// loading database
var mongo = require('mongodb');
var server = mongo.Server('localhost', 27017, {auto_reconnect: true});
var db = mongo.Db('mydb', server, {safe:true});

//var url = require('url');



// create new user
exports.createUser = function(request, response) {
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
};

/* app.get('/listUsers', function(request, response){
  db.users.find()
}); */
