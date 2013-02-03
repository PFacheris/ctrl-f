// loading database
var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';

var url = require('url');

// create new user
exports.createUser = function(request, response) {
  var firstName, lastName, email;
 
  var queryData = url.parse(request.url, true).query;

/* 
 // if (queryData.firstName) {
    firstName = queryData.firstName;
 // } else {
 //   firstName = "first";
 //}

  if (queryData.lastName) {
    lastName = queryData.lastName;
  } else {
    lastName = "last";
  }

  if (queryData.email) {
    email = queryData.email;
  } else {
    email = "email";
  }
*/

  var newPerson = {name: {firstName: queryData.firstName, lastName: queryData.lastName}, email: queryData.email};

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
