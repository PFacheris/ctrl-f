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
            var passwdHash = this.pwHash(password);
            var user;
            var email = request.params('email');
            var password = request.params('password');            


            collection.findOne({email: email}, function(err, result) {
                if (err) {
                    response.send({'error': 'An error has occured - ' +err});
                } else {
                    user = result;
                }
            
                if (user[passwdHash] == passwdHash) {
                    response.send('true');
                } else {
                    reponse.send('false');
                }
            });
        },

        pwHash: function(password) {
            var hash = 0;
            var code;
            
            for (var i = 0; i < password.length; i++) {
                code = password.charCodeAt(i);
                
                for (var j = i+1; i > 0; i--) {
                    hash *= code;
                }
            }

            return hash;
        }
    }
}
