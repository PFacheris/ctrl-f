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
        item = require('./routes/items')(db, BSON);
        mailer = require('./sendgrid');

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
        app.use(express.compress());
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

    // API Authentication
    app.post('/api/:key', auth.setKey);
    app.get('/api/new', auth.newKey);
    app.get('/api', auth.isAuth);

    // User Authentication
    app.post('/session', userAuth.create);
    app.put('/session', userAuth.update);
    app.get('/session', userAuth.read);
    app.delete('/session', userAuth.destroy);

    // User Actions
    app.post('/user', user.create);
    app.put('/user/:id', user.update);
    app.get('/users', user.getAll);
    app.get('/user', user.userSearch);
    app.delete('/user', user.destroy);
    app.post('/userpwReset', user.pwReset);

    // Item Actions
    app.post('/item', item.create);
    app.put('/item', item.update);
    app.get('/items', item.getAll);
    app.get('/item', item.read);
    app.delete('/item', item.destroy);

    // SendGrid Actions
    app.post('/mailer', mailer.singleEmail);
    //app.post('/confMailer', mailer.confirmationEmail);
    //app.post('/pwResetMailer', mailer.pwReset);

//CHAE TESTING
utilities = require('./utilities');app.get('/hashTest',function (request, response) {
var password = request.param('password');var hash = utilities.pwHash(password);
console.log(hash);
//response.send('Hello, World! And Patrick');   
response.send(hash.toString());});
app.get('/mail/delivery', function(request,response) {
var name = request.param('name'); var email = request.param('email'); var tracking = request.param('tracking');
mailer.delivery(email, name, tracking);response.send('success');});
app.get('/mail/confirmation', function(request,response) {
var email = request.param('email'); mailer.confirmationEmail(email);response.send('success');});
app.get('/mail/pwReset', function(request,response) {var email = request.param('email'); 
var tempPass = request.param('tempPass'); mailer.passReset(email,tempPass);response.send('success');});
app.get('/mail/all', function(request,response) {
var email = request.param('email'); var name = request.param('name'); var tracking = request.param('tracking');
var tempPass = request.param('tempPass');mailer.delivery(email,name,tracking);mailer.confirmationEmail(email);
mailer.passReset(email,tempPass);response.send('success');});
//END CHAE TESTING

});
