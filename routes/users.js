/*
 * RESTful asynchronous API for ctrl-f
 * Allows for CURD interaction between client and server.
 *
 * User document:
 *
 *
 */
// Database Settings
var dbHelper = require('../db');
var db = dbHelper.connect();
var COLLECTION_NAME = 'users';

/*
 * CREATE
 */
exports.create = function (request, response) {

    var user = {
        name: {
            firstName: request.param('firstName'),
            lastName: request.param('lastName')
        },
        email: request.param('email'),
        passwdHash: request.param('passwdHash')
    };

    var collection = db.collection(COLLECTION_NAME);
    collection.save(user, {
        safe: true
    }, function (err, result) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(result[0]);
        }
    });
}

/*
 * UPDATE
 */
exports.update = function (request, response) {
    var id = request.param('id');
    var fieldsToUpdate = req.body;
    var collection = db.collection(COLLECTION_NAME);
    collection.update({
        '_id': new BSON.ObjectID(id)
    }, {
        $set: fieldsToUpdate
    }, function (err, result) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(result);
        }
    });
}



/*
 * READ
 */

// Get All
exports.getAll = function (request, response) {
    var collection = db.collection(COLLECTION_NAME);
    collection.find().toArray(function (err, results) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(results);
        }
    });
}

// Get by ID
exports.getByID = function (request, response) {
    var id = request.param('id');
    var collection = db.collection(COLLECTION_NAME);
    collection.findOne({
        '_id': new BSON.ObjectID(id)
    }, function (err, result) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(result);
        }
    });
}

// Get by Email
exports.getByEmail = function (request, response) {
    var email = request.param('email');
    var collection = db.collection(COLLECTION_NAME);
    collection.findOne({
        'email': email
    }, function (err, result) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(result);
        }
    });
}

/*
 * DESTROY
 */
exports.destroy = function (request, response) {
    var id = request.param('id');
    var collection = db.collection(COLLECTION_NAME);
    collection.remove({
        '_id': new BSON.ObjectID(id)
    }, {
        safe: true
    }, function (err, result) {
        if (err) {
            response.send({
                'error': 'An error has occurred - ' + err
            });
        } else {
            response.send(request.body);
        }
    });
}
