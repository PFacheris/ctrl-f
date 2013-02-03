// loading database
var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';

// create new user
exports.createUser = function(request, response) {
  var firstName, lastName, email;
  
  if (request.query["firstName"] != null) {
    firstName = request.query["firstName"];
  } else {
    firstName = first;
  }

  if (request.query["lastName"] != null) {
    lastName = request.query["lastName"];
  } else {
    lastName = last;
  }

  if (request.query["email"] != null) {
    email = request.query["email"];
  } else {
    email = email;
  }

  var newPerson = {name: {firstName: firstName, lastName: lastName}, email: email};

  mongo.connect(mongoUri, function (err, db) {
      var collection = db.collection('users');
        collection.insert(newPerson, {safe:true}, function(err, result) {
            if (err)
            {
                response.send({'error':'An error has occurred'});
            }
            else
            {
                console.log('Success: ' + JSON.stringify(result[0]));
                response.send(result[0]);
            }
        });
  });
}

/* app.get('/listUsers', function(request, response){
  db.users.find()
}); */
