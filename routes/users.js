/*
 * RESTful asynchronous API for ctrl-f
 * Allows for CURD interaction between client and server.
 *
 * User document:
 *
 *
 */
// Database Settings
var COLLECTION_NAME = 'users';
userAuth = require('../auth_user.js');
utilities = require('../utilities.js');

module.exports = function (db, BSON) {
    return {
        /*
         * CREATE
         */
        create: function (request, response) {
            var passwdHash = utilities.pwHash(request.param('password'));


            var user = {
                name: {
                    firstName: request.param('firstName'),
                    lastName: request.param('lastName')
                },
                email: request.param('email'),
                passwdHash: passwdHash,
                items: []
            };

            var collection = db.collection(COLLECTION_NAME);
            collection.insert(user, {
                safe: true
            }, function (err, result) {
                if (err) {
                    response.send(400);
                } else {
                    response.send(result[0]);
                }
            });
        },

        /*
         * UPDATE
         */
        update: function (request, response) {
            var id = request.param('id');
            var fieldsToUpdate = request.body;
            var collection = db.collection(COLLECTION_NAME);
            
            // "Replacement" style update.  Not to be used for adding an item
            // @param selector=update required 
            if (request.param('selector') == 'update') {
                collection.update({
                    '_id': new BSON.ObjectID(id)
                }, {
                    $set: fieldsToUpdate
                }, function (err, result) {
                    if (err) {
                        response.send(400);
                    } else {
                        response.send(result);
                    }
                });
            // $push style update for adding an item
            // @param selector=addItem required
            } else if (request.param('selector') == 'addItem') {
                collection.update({
                    '_id': new BSON.ObjectID(id)
                }, {
                    $addToSet: {items: request.param('items')}
                }, function (err, result) {
                    if (err) {
                        response.send(400);
                    } else {
                        response.send(result);
                    }
                });
            } else {
                response.send('Improper Request');
            }
        },

        /*
         * READ
         */

        // Get All
        getAll: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            collection.find().toArray(function (err, results) {
                if (err) {
                    response.send(500);
                } else {
                    response.send(results);
                }
            });
        },

        // Generic Get
        userSearch: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var firstName, lastName, email, item, id;
            var searchParam;
 
            // Check existence of paramters in order and create corresponding searchParam
            if (request.param('id')) {
                id = request.param('id');
                searchParam = {'_id': new BSON.ObjectID(id)};

            } else if (request.param('item')) {
                item = request.param('item');
                searchParam = {'items': item};

            } else if (request.param('email')) {
                email = request.param('email');
                searchParam = {'email': email};

            } else if (request.param('firstName') && request.param('lastName')) {
                firstName = request.param('firstName');
                lastName = request.param('lastName');
                searchParam = {'name': {'firstName': firstName, 'lastName': lastName}};

            } else {
                response.send('No search term specified');
            }

            // Execute search
            collection.find(searchParam,{passwdHash: 0}).toArray(function (err, results) {
                if (err) {
                    response.send(500);
                } else {
                    response.send(results);
                }
            });
        },  

        /*
         * DESTROY
         */

        destroy: function (request, response) {
            var id = request.param('id');
            var collection = db.collection(COLLECTION_NAME);
            collection.remove({
                '_id': new BSON.ObjectID(id)
            }, {
                safe: true
            }, function (err, result) {
                if (err) {
                    response.send(400);
                } else {
                    response.send(request.body);
                }
            });
        }
    }
}
