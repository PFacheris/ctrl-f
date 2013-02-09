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
            delete user.passwordConfirm;
            
            user.items = []; // necessary for add to item function           
 
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

            // send sign up confirmation email
            sendgrid.confirmationEmail(user.email.toString());
        },

        /*
        * UPDATE
        */
        update: function (request, response) {
            var id = request.param('id');
            var user = request.body;
console.log(user);
            var passwdHash = utilities.pwHash(user.password);
            user.passwdHash = passwdHash;
            delete user.password;
            
            
            var collection = db.collection(COLLECTION_NAME);
            collection.update({'_id': new BSON.ObjectID(id)}, user, {
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
            var user = request.query;

            if (user)
            {
                // Execute search
                collection.findOne(user, function (err, result) {
                    if (err) {
                        response.send(500);
                    } else {
                        response.send(result);
                    }
                });
            }
            else
            {
                response.send(404);
            }
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
                    var newHash = utilities.pwHash(result.passwdHash.toString());
                    collection.update({'_id': new BSON.ObjectID(id)},
                    // set new password equal to old password hash
                    {$set: {passwdHash: newHash}},
                    function (er, res) {
                        if (er) {
                            response.send(400);
                        } else {
                            response.send('Successful reset');
                        }
                    });
                    //send reset email
                    sendgrid.passReset(result.email,result.passwdHash);

                }
            });
        }
    }
}
