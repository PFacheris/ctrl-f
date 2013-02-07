/* 
* File controlling item creation and manipulation
*
*
*
*/
var COLLECTION_NAME = 'items';

module.exports = function (db, BSON) {
    return {
        // Create Item
        create: function (request, response) {
            var item = request.body;
            var collection = db.collection(COLLECTION_NAME);
            collection.insert(item, {safe:true}, function(err, result) {
                if (err) {
                    response.send(400);
                } else {
                    response.send(result);
                }
            });
        },


        // Update item
        update: function (request, response) {
            var id = request.param('id');
            var item = request.body;
            delete item._id;

            var collection = db.collection(COLLECTION_NAME);
            collection.update({'_id' : new BSON.ObjectID(id)},
                item, {safe: true}, function (err, result) {
                    if (err) {
                        response.send(400);
                    } else {
                        response.send(result);
                    }
            });
        },


        // GetAll Parcels
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


        // Generic Item Search
        read: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var id, name, tracking, service;
            var searchParam;

            // Check existence of paramters in order and create corresponding searchParam
            if (request.param('id')) {
                id = request.param('id');
                searchParam = {'_id': new BSON.ObjectID(id)};

            } else if (request.param('name')) {
                name = request.param('name');
                searchParam = {'name': name};

            } else if (request.param('tracking')) {
                tracking = request.param('tracking');
                searchParam = {'trackingNumber': tracking};

            } else {
                response.send('No search term specified');
            }

            // Execute search
            collection.find(searchParam).toArray(function (err, results) {
                if (err) {
                    response.send(500);
                } else {
                    response.send(results);
                }
            });
        }, 
        
        // Destroy entry
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
