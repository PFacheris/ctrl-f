/*
 * Requires and initialization.
 */
//Dependencies
var express = require("express"),
    path = require("path");

var MONGO = require('mongodb'),
    MONGO_CLIENT = MONGO.MongoClient,
    MONGO_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb',
    BSON = MONGO.BSONPure,
    db = null;

MONGO_CLIENT.connect(MONGO_URI, function (err, db) {
    if (err)
    {
        console.log("No DB found. Continuing may be unsafe.");
    }

    var auth = require('./auth_api')(db, BSON),
        user = require('./routes/users')(db, BSON);
        userAuth = require('./auth_user')(db, BSON);

    var app = express();

    var application_root = process.cwd();

    /*
     * Listening Port
     */
    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Listening on " + port);
    });

    /*
     * Application Logic
     */

    // Session Storage
    var sessionStore = new express.session.MemoryStore;

    // Config
    app.configure(function () {
        app.set('title', 'ctrl-f API');
        app.use(express.cookieParser("secret"))
        app.use(express.session({
            store: sessionStore
        }));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(application_root, "public")));
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    // Authentication
    app.post('/api/:key', auth.setKey);
    app.get('/api/new', auth.newKey);
    app.get('/api', auth.isAuth);

    // User Actions
    app.post('/user/new', user.create);
    app.put('/user/:id', auth.isAuth, user.update);
    app.get('/users', user.getAll);
    app.get('/user', user.userSearch);
    app.delete('/user/:id', auth.isAuth, user.destroy);

    // User Authentication
    app.post('/session', userAuth.loginAuth);

    utilities = require('./utilities');
    app.get('/hashTest', 
    function (request, response) {
    var password = request.param('password');

    var hash = utilities.pwHash(password);

    response.send(hash);
}


);
});
