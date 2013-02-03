// loading database
var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';

var url = require('url');




// create new user
exports.createUser = function(request, response) {
  var firstName, lastName, email, passwdHash, username;
 

// parse user information in JSON
  var queryData = url.parse(request.url, true).query;
 
  if (queryData.firstName) {
    firstName = queryData.firstName;
  } else {
    firstName = null;
  }

  if (queryData.lastName) {
    lastName = queryData.lastName;
  } else {
    lastName = null;
  }

  if (queryData.email) {
    email = queryData.email;
  } else {
    email = null;
  }

  if (queryData.passwdHash) {
    passwdHash = queryData.passwdHash;
  } else {
    passwdHash = null;

// _id requires unique identifier; ergo, cannot default to null value
  if (queryData.username) {
    username = queryData.passwdHash;
  }


// create person and add to database
  var newPerson = {name: {firstName: firstName, lastName: lastName}, email: email, passwdHash: passwdHash, _id: username};

  mongo.connect(mongoUri, function (err, db) {
      var collection = db.collection('users');
        collection.save(newPerson, {safe:true}, function(err, result) {
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


// list all users
exports.listUsers = function(request, response){
  db.collection('mydb', function(err, collection){
    collection.find().toArray(function(err, items) {
      request.send(items);
    });
  });
}


//delete user
exports.deleteUser = function (request, response){
  var id = req.params.id;
  db.collection('mydb', function(err, collection) {
    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        response.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        response.send(wine);
      }
    });
  });
}
