utilities = require('./utilities');

var COLLECTION_NAME = 'users';
module.exports = function (db, BSON) {
    return {
        // Check if Authenticated
        isAuth: function checkAuth(request, response, next) {
            
            if (!request.session.authenticated) {
                response.send('Not authenticated. Incorrect Password.');
            } else {
                next();
            }
        },

        // check if login password hashes to value in db
        loginAuth: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var user;
            var email = request.param('email');
            var password = request.param('password');            
            var passwdHash = utilities.pwHash(password);

console.log(passwdHash);

            collection.findOne({email: email}, function(err, result) {
                if (err) {
                    response.send({'error': 'An error has occured - ' +err});
                } else {
                    user = result;
                }
            
                if (user[passwdHash] == passwdHash) {
                    response.send('true');
                } else {
                    response.send('false');
                }
            });
        },
    }
}
