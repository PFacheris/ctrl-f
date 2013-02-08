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
var userAuth = require('../auth_user.js');
var utilities = require('../utilities.js');
var sendgrid = require('../sendgrid.js');

module.exports = function (db, BSON) {
    return {
        /*
        * CREATE
        */
        create: function (request, response) {
            var user = request.body;

            var passwdHash = utilities.pwHash(user.password);
            user.passwdHash = passwdHash;
            delete user.password;
            
            
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
            var user = request.body;

            var passwdHash = utilities.pwHash(user.password);
            user.passwdHash = passwdHash;
            delete user.password;
            
            
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
        },


        /*
        * Password Reset
        */

        pwReset: function (request, response) {
            var id = request.param('id');
            var collection = db.collection(COLLECTION_NAME);

            collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, result) {
                if (err) {
                    response.send(400);
                } else {
                    console.log(result.passwdHash);
                    console.log(result);
                    collection.update({'_id': new BSON.ObjectID(id)},
                    // set new password equal to old password hash
                    {$set: {passwdHash: utilities.pwHash(result.passwdHash)}},
                    function (er, res) {
                        if (er) {
                            response.send(400);
                        } else {
                            response.send('Successful reset');
                        }
                    });
                    //send reset email
                    sendgrid.passReset('cjubb39@gmail.com','temppassword');

                }
            });
        }
    }
}
