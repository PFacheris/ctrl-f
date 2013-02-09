/* 
* File controlling item creation and manipulation
*
*
*
*/
var COLLECTION_NAME = 'items';
var tracking = require('dhl');

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

        // pacakge delivery checker 
        // @param tracking=trackingNumber
        updateParcelStatus: function (request, response) {
            var collection = db.collection(COLLECTION_NAME);
            var searchParam = {tracking: request.param('tracking')};

            collection.findOne(searchParam, function (err, results) {
                if (err) {
                    response.send(400);
                } else {
                    var packet = {
                        service: results.service.toString(),
                        id: results.tracking.toString()
                    }

                    tracking.track(packet, function (request, response) {
                        collection.udpate(results, {$set: {trackingInfo: response}}, function (er, res) {
                           if (er) {
                               response.send(400);
                           } else {
                              response.send(res);
                           }
                        });
                    });
                }
           });
        },

        // all undelivered package delivery checker
        updateParcelStati: function (request, response) {
            var time = 10000; // in milliseconds

            // repeat every 'time' seconds
            setInterval(function () {
            
            console.log('package update begin');
            var collection = db.collection(COLLECTION_NAME);
            var searchParam = {type: 'Parcel', delievered: false};

            collection.find(searchParam).toArray(function (err, results) {
                if (err) {
                    response.send(400);
                } else {
                    for (i=0; i < results.length; i++) {
                        var packet = {
                            service: results[i].service.toString(),
                            id: results[i].tracking.toString()
                        }

                        tracking.track(packet, function (request, response) {
                            if (response.delivered == true) {
                                // find email associated with item
                                userCollection = db.collection('users');
                                userCollection.findOne({items: results[i].tracking.toString()},
                                    function (er, res) {
                                        if (er) {
                                            response.send(400);
                                        } else {
                                            var name;
                                            if (results[i].name) {
                                                name = results[i].name.toString();
                                            } else {
                                                name = ' ';
                                            }
                                            sendgrid.delivered(res.email.toString(), name, 
                                                results[i].tracking.toString());
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
                        });
                    }
                }
            });
            console.log('package update complete');
        }, time);}
    }
}
