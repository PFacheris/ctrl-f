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
module.exports = function (db, BSON) {
    return {
        /*
         * CREATE
         */
        create: function (request, response) {

            var user = {
                name: {
                    firstName: request.param('firstName'),
                    lastName: request.param('lastName')
                },
                email: request.param('email'),
                passwdHash: request.param('passwdHash'),
                items: []
        };

            var collection = db.collection(COLLECTION_NAME);
            collection.insert(user, {
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
        },

        /*
         * UPDATE
         */
        update: function (request, response) {
            var id = request.param('id');
            var fieldsToUpdate = request.body;
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
        },


        /*
         * READ
         */

        // Get All
        getAll: function (request, response) {
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
        },

        // Get by ID
        getByID: function (request, response) {
            var id = request.param('id');
            var collection = db.collection(COLLECTION_NAME);
            collection.findOne({
                '_id': id
            }, function (err, result) {
                if (err) {
                    response.send({
                        'error': 'An error has occurred - ' + err
                    });
                } else {
                    response.send(result);
                }
            });
        },

        // Get by Email
        getByEmail: function (request, response) {
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
        },


        // Generic Get
        userSearch: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var firstName, lastName, email, item, id;
            var searchParam, searchResult;
 
            // Check existence of paramters in order and create corresponding searchParam
            if (request.param('id')) {
                id = request.param('id');
                searchParam = {'_id': new BSON.ObjectID(id)};

            } else if (request.param('items')) {
                item = request.param('items');
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

            
		console.log(searchParam); //

            // Execute search
            collection.find(searchParam).toArray(function (err, results) {
                if (err) {
                    response.send({
                        'error': 'An error has occurred - ' + err
                    });
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
                    response.send({
                        'error': 'An error has occurred - ' + err
                    });
                } else {
                    response.send(request.body);
                }
            });
        }
    }
}
