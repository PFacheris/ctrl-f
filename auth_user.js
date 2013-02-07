utilities = require('./utilities');

var COLLECTION_NAME = "users";
module.exports = function (db, BSON) {
    return {
        // check if login password hashes to value in db
        create: function (request, response) {
            var usersCollection = db.collection(COLLECTION_NAME);
            var email = request.param('email');
            var password = request.param('password');            
            var passwdHash = utilities.pwHash(password);

            usersCollection.findOne({email: email}, function(err, result) {
                var user;
                if (err) {
                    response.send({'error': 'An error has occured - ' + err});
                } else {
                    user = result;

                    if (user != null) {
                        if (user['passwdHash'] == passwdHash) {
                            var token = BSON.ObjectID();
                            request.session.userToken = token;
                            response.send({email: email, password: "", token: token});
                        } else {
                            response.send(401);
                        }
                    } else {
                        response.send(401);
                    }
                }
            });
        },

        // Check if Authenticated
        read: function (request, response, next) {
            var token = request.session.userToken;
            if (token && request.param('token') == token) {
                response.send(200);
            }
            else {
                response.send(401);
            }
        },

        update: function (request, response)
        {
            var usersCollection = db.collection(COLLECTION_NAME);
            var email = request.param('email');
            var password = request.param('password');            
            var passwdHash = utilities.pwHash(password);

            usersCollection.findOne({email: email}, function(err, result) {
                var user;
                if (err) {
                    response.send({'error': 'An error has occured - ' + err});
                } else {
                    user = result;
                }

                if (user != null) {

                    if (user['passwdHash'] == passwdHash) {
                        var token = BSON.ObjectID();
                        request.session.userToken = null;
                        request.session.userToken = token;
                        response.send({email: email, password: "", token: token});
                    } else {
                        response.send(401);
                    }
                } else {
                    response.send(401);
                }
            }); 
        },

        destroy: function (request, response)
        {
            request.session.userToken = null;
        }
    }
}
