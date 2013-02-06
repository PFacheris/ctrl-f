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
        createParcel: function (request, response) {
            var parcel = {
                type: 'Parcel',
                name: request.param('name'),
                trackingNumber: request.param('tracking'),
                deliveryService: request.param('service'),
                arrived: false
            };

            var collection = db.collection(COLLECTION_NAME);
            collection.insert(parcel, {safe:true}, function(err, result) {
                if (err) {
                    response.send({'error': 'An error has occured - ' +err});
                } else {
                    response.send(result);
                }
            });
        },


        // Update item
        update: function (request, response) {
            var id = request.param('id');
            var fieldsToUpdate = request.body;
            var collection = db.collection(COLLECTION_NAME);

            collection.update({'_id' : new BSON.ObjectID(id)},
                {$set: fieldsToUpdate}, function (err, result) {
                    if (err) {
                        response.send({'error': 'An error has occured - ' +err});
                    } else {
                        response.send(result);
                    }
            });
        },


        // GetAll Parcels
        getAllParcels: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            
            collection.find({type: 'parcel'}).toArray(function (err, results) {
                if (err) {
                    response.send({'error': 'An error has occured - ' + err});
                } else {
                    response.send(results);
                }
            });
        },


        // Generic Parcel Search
        parcelSearch: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var id, name, tracking, service
            var searchParam;

            // Check existence of paramters in order and create corresponding searchParam
            if (request.param('id')) {
                id = request.param('id');
                searchParam = {'type': 'parcel', '_id': new BSON.ObjectID(id)};

	    } else if (request.param('name')) {
		name = request.param('name');
		searchParam = {'type': 'parcel', 'name': name};

	    } else if (request.param('tracking')) {
		tracking = request.param('tracking');
		searchParam = {'type': 'parcel', 'trackingNumber': tracking};

	    } else if (request.param('service')) {
		service = request.param('service');
		searchParam = {'type': 'parcel', 'deliveryService': service};

	    } else {
		response.send('No search term specified');
	    }

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
