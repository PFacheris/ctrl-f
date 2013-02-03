// loading database
var mongo = require('mongodb');
var server = mongo.Server('localhost', 27017, {auto_reconnect: true});
var db = mongo.Db('mydb', server, {safe:true});

//var url = require('url');
var collection = db.collection('users');


// create new user
exports.createUser = function(request, response) {
  var firstName, lastName, email;
  
  if (request.query["firstName"]) {
    firstName = request.query["firstName"];
  } else {
    name = null;
  }

  if (request.query["lastName"]) {
    lastName = request.query["lastName"];
  } else {
    lastName = null;
  }

  if (request.query["email"]) {
    email = request.query["email"];
  } else {
    email = null;
  }

  var newPerson = {name: {firstName: firstName, lastName: lastName}, email: email};

  db.collection('users', function(err, collection) {
        collection.insert(newPerson, {safe:true}, function(err, result) {
            if (err) {
                response.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                response.send(result[0]);
            }
        });
    });
};

/* app.get('/listUsers', function(request, response){
  db.users.find()
}); */
