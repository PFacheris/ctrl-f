var COLLECTION_NAME = 'keys';
module.exports = function (db, BSON) {
    return {
        // Check if Authenticated
        isAuth: function checkAuth(request, response, next) {
            console.log(db);
            if (!request.session.authenticated) {
                response.send('API key not recognized, please reconnect using a different API key.');
            } else {
                next();
            }
        },

        // Check if API Key is valid and Authenticate
        setKey: function (request, response) {
            var key = request.param('key');
            if (key) {
                var collection = db.collection(COLLECTION_NAME);
                collection.findOne({
                    '_id': new BSON.ObjectID(key)
                }, function (err, result) {
                    if (err) {
                        response.send({
                            'error': 'An error has occurred - ' + err
                        });
                    } else {
                        request.session.authenticated = true;
                    }
                });
            }
        },

        // Generate New API Key
        newKey: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            collection.insert({
                '_id': new BSON.ObjectID()
            }, function (err, result) {
                if (err) {
                    response.send({
                        'error': 'An error has occurred - ' + err
                    });
                } else {
                    request.session.authenticated = true;
                    response.send(result);
                }
            });
        }
    }
}
