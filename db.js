var MONGO = require('mongodb').MongoClient,
    MONGO_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb',
    BSON = MONGO.BSONPure,
    db;
    
exports.connect = function () {
    if (!db) db
    {
        MONGO.connect(MONGO_URI, function (err, database) {
            db = database;
        });
    }

    return db
}

exports.disconnect = function() {
    db.close();
    db = null
}

exports.BSON = BSON;
