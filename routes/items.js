/* 
* File controlling item creation and manipulation
*
*
*
*/
var COLLECTION_NAME = 'items';
var tracking = require('dhl');

module.exports = function (db, BSON) {
    var methods = {}
    
    // pacakge delivery checker 
    // @param tracking=trackingNumber
    methods.updateParcelStatus = function (trackingNumber) {
        var collection = db.collection(COLLECTION_NAME);
        var searchParam = {tracking: trackingNumber};

        collection.findOne(searchParam, function (err, results) {
            if (err) {
                return false;
            } else {
                var packet = {
                    service: results.service.toString(),
                    id: results.tracking.toString()
                }

                tracking.track(packet, function (request, response) {
                    collection.update(results, {$set: {trackingInfo: response}}, function (er, res) {
                        if (er) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
            }
        });
    },

    // Create Item
    methods.create = function (request, response) {
        var item = request.body;
        var collection = db.collection(COLLECTION_NAME);
        
        var packet = {
            service: item.service.toString(),
            id: item.tracking.toString()
        };

        tracking.track(packet, function (tracking) {
		//request.trackingInfo = tracking.data.steps;
                //request.delivered = tracking.data.delivered;
                collection.insert(item, {safe:true}, function(err, result) {
		    if (err) {
			response.send(400);
		    } else {
console.log(result._id);
                collection.update(item, {$set: {trackingInfo: tracking.data.steps, delivered: tracking.data.delivered}},
                    function (er, output) {
                        if (er) {
                            response.send(400);
                        } else {
                            collection.findOne({'_id': result._id}, function (e, res) {
                                if (e) {response.send(400)}
                                else {console.log(res);response.send(res)}
                            });
                        }
                });
               }
            });
           });

    },


    // Update item
    methods.update = function (request, response) {
        var id = request.param('_id');
        var item = request.body;
        delete item._id;

        var collection = db.collection(COLLECTION_NAME);
        collection.update({'_id' : new BSON.ObjectID(id)},
        {$set: item}, {safe: true}, function (err, result) {
            if (err) {
                response.send(400);
            } else {
                response.send(result);
            }
        });
    },


    // GetAll Items
    methods.getAll = function (request, response) {
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
    methods.read = function (request, response) {
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
        methods.destroy = function (request, response) {

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



        // all undelivered package delivery checker
        methods.updateParcelStati = function (request, response) {
            var time = 100000; // in milliseconds

            // repeat every 'time' seconds
            setInterval(function () {

                console.log('parcel update begin');
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
                console.log('parcel update complete');
            }, time);
        }

        return methods;
}


