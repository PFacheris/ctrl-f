/* 
* File controlling item creation and manipulation
*
*
*
*/
var COLLECTION_NAME = 'items';
var tracking = require('packmule');

// Credentials for packmule
var fedexCredentials = {
    key: 'Qpl5pWPVtGG5MHxL',
    password: 'tBbtJQok2nFtNHJUWW6wDcZai',
    number: '357267196',
    meter: '104876784'
};

var upsCredentials = {
    key: "8CAF46F7778C3870",
    user: "Club1505",
    password: "Schapiro1"
};

var uspsCredentials = {
    id: '8521505I1183'
};

/*
* Gets correct credential set for passing to packmule.
* @param string carrier a string representing an active carrier for packmule
*
*/
var getCredentials = function (carrier)
{
    switch(carrier.toLowerCase()){
        case "fedex":
            return fedexCredentials;
        case "ups":
            return upsCredentials;
        case "usps":
            return uspsCredentials;
        default:
            return;
    }
};

// Exported methods for item creation and manipulation
module.exports = function (db, BSON) {
    var methods = {}

    // package delivery checker 
    methods.updateParcelStatus = function (item) {
        var collection = db.collection(COLLECTION_NAME);
        var packet = {
            carrier: item.service,
            number: item.tracking
        }

        var credentials = getCredentials(results.service.toString());

        tracking.track(credentials, packet, function (tracking) {
            if (tracking.data.steps != item.trackingInfo)
            {
                var toUpdate = {"delivered": tracking.data.delivered, "trackingInfo": tracking.data.steps};
                collection.update({'_id' : new BSON.ObjectID(item.id)}, {$set: toUpdate}, function (er, res) {
                    if (er) return false;
                    var users = db.collection('users');
                    users.find({"items._id": item.id}).toArray(function (err, results) {
                        if (err) return false;
                        var email;
                        var name = item.name ? item.name : "Your package shipped by " + item.service.toUpperCase(); 
                        for (var i = 0; i < results.length; i++)
                        {
                            email = results[i].email;
                            sendgrid.delivered(email, name, item.tracking.toString());
                        }
                        return true;
                    })
                });
            }
        });
    },

// Create Item
methods.create = function (request, response) {
    var item = request.body;
    var collection = db.collection(COLLECTION_NAME);

    var packet = {
        carrier: item.service.toString(),
        number: item.tracking.toString()
    };

    var credentials = getCredentials(item.service.toString());

    tracking.track(credentials, packet, function (tracking) {
        item.trackingInfo = tracking.data.steps;
        item.delivered = tracking.data.delivered;
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                response.send(400);
            } 
            else{
                response.send(item);
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
    var item = request.query;
    if (item._id) item._id = new BSON.ObjectID(item._id);

    if (item) {
        // Execute search
        collection.findOne(item, function (err, result) {
            if (err) {
                response.send(500);
            }
            else if (result == null) {
                response.send(404);
            }else {
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

        collection.find({ "delivered": false }).toArray(function (err, results) {
            if (err) {
                response.send(400);
            } else {
                for (i=0; i < results.length; i++) {
                    updateParcelStatus(result[i]);
                }
            }
        });
        console.log('parcel update complete');
    }, time);
}

return methods;
}
