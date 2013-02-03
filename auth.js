var MONGO = require('mongodb').MongoClient,
    MONGO_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb',
    BSON = MONGO.BSONPure,
    COLLECTION_NAME = 'keys';

// Check if Authenticated
exports.isAuth = function checkAuth(request, response, next) {
  if (!request.session.authenticated) {
    response.send('API key not recognized, please reconnect using a different API key.');
  }
  else {
    next();
  }
}

// Check if API Key is valid and Authenticate
exports.setKey = function (request, response) {
  var key = request.param('key');
  if (key) {
    MONGO.connect(MONGO_URI, function (err, db) {
        var collection = db.collection(COLLECTION_NAME);
        collection.findOne({'_id': new BSON.ObjectID(key)}, function (err, result) {
            if (err) {
                response.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                request.session.authenticated = true;
            }
        });
    });
  }
}

// Generate New API Key
exports.newKey = function (request, response) {
    MONGO.connect(MONGO_URI, function (err, db) {
        var collection = db.collection(COLLECTION_NAME);
        collection.insert({'_id': new BSON.ObjectID('test')}, function (err, result) {
            if (err) {
                response.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                request.session.authenticated = true;
                response.send(result);
            }
        });
    });
}

