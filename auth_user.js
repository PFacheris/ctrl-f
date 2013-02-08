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
                            request.session.userEmail = email;
                            request.session.userId = user.id;
                            response.send({id: user.id, email: email, password: "", token: token});
                        } else {
                            response.send({email: email, password: "", token: ""});
                        }
                    } else {
                        response.send({email: email, password: "", token: ""});
                    }
                }
            });
        },

        // Check if Authenticated
        read: function (request, response, next) {
            var token = request.session.userToken;
            console.log(token);
            if (token && request.param('token') == token) {
                response.send({id: request.session.userId, email: request.session.email, password: "", token: token});
            }
            else {
                response.send({email: request.session.email, password: "", token: ""});
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
                        request.session.email = null;
                        request.session.userId = null;
                        request.session.userToken = token;
                        request.session.email = email;
                        request.session.userId = user.id;
                        response.send({id: user.id, email: email, password: "", token: token});
                    } else {
                        response.send({email: email, password: "", token: ""});
                    }
                } else {
                        response.send({email: email, password: "", token: ""});
                }
            }); 
        },

        destroy: function (request, response)
        {
            request.session.userToken = null;
            request.session.email = null;
            request.session.userId = null;
        }
    }
}
