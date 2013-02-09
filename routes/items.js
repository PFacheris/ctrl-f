/* 
* File controlling item creation and manipulation
*
*
*
*/
var COLLECTION_NAME = 'items';
var tracking = require('../tracking.js');

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
            var id = request.param('_id');
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


        // GetAll Items
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
            var user = request.query;

            if (user) {
            // Execute search
                collection.findOne(user, function (err, result) {
                    if (err) {
                        response.send(500);
                    } else {
                        response.send(result);
                    }
                });
            } else {
                response.send(417);
            }
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
        },

        // package delivery checker
        updateParcelStatus: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var searchParam = {type: 'Parcel', delievered: false};
            var isItThereYet = null;

            collection.find(searchParam).toArray(function (err, results) {
                if (err) {
                    response.send(400);
                } else {
                    for (i=0; i < results.length; i++) {
                      /*var service = results[i].service;
                        switch (service) {
                            case 'USPS': 
                                isItThereYet = tracking.USPS(result[i].tracking.toString()).delivered;
                                break;
                            case 'DHL': 
                                isItThereYet = tracking.DHL(result[i].tracking.toString()).delivered;
                                break;
                            case 'UPS': 
                                isItThereYet = tracking.UPS(result[i].tracking.toString()).delivered;
                                break;
                            case 'FedEx': 
                                isItThereYet = tracking.FedEx(result[i].tracking).toString().delivered;
                                break;                           
                        }

                        if (isItThereYet = true) {
                            // find email associated with item
                            userCollection = db.collection('users');
                            userCollection.findOne({items: results[i].trackingNumber.toString()},
                                function (er, res) {
                                    if (er) {
                                        response.send(400);
                                    } else {
                                        var name;
                                        if (results[i].name) {
                                            name = results[i].name.toString();
                                        } else {
                                            name = ' '
                                        }
                                        sendgrid.delivered(res.email.toString(), name, 
                                            results[i].trackingNumber.toString());
                                    }
                            });
                            // mark package as delivered
                            collection.update({'_id': results[i].id.$oid}, 
                                {delivered: true}, function(e, re) {
                                    if (e) {
                                        response.send(400);
                                    } else {
                                        response.send(re);
                                    }
                            });
                        }
                      */
                    }
                }
            });
        }
                        
    }
}
