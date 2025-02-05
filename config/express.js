var express = require('express');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var session = require('express-session');
var compression = require('compression');
var app = express();
var dotenv = require('dotenv');
var multer = require('multer');

module.exports = function () {
    if (process.env.NODE_ENV == 'development') {
        ///// FOR SESSION SET /////
        app.use(session({ resave: true, saveUninitialized: true, secret: 'MySecretSystem', maxAge: '1h' }));
    } else if (process.env.NODE_ENV == 'production') {
        var RedisStore = require('connect-redis')(session);
        var redis = require("redis");
        var client = redis.createClient();
        ///// FOR SESSION SET /////
        app.use(session({ resave: true, saveUninitialized: true, secret: 'MySecretSystem', maxAge: '1h', store: new RedisStore({ host: 'localhost', port: 6379, client: client, ttl: 1440 }) }));
    }
    app.use(express.static('./public', { maxAge: '1y' }));
    app.use(express.static('./uploads', { maxAge: '1y' }));
    app.use(express.static('./data', { maxAge: '1d' }));
    app.use(compression());
    // use bodyParser middleware on express app   
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(multer({ dest: __dirname + '/data/' }).any());
    dotenv.config({ path: 'error_success_strings.env', silent: true });
    dotenv.config({ path: 'admin_strings.env', silent: true });
    dotenv.config({ path: 'setting_strings.env', silent: true });

    app.set('views', ['./application/views']);

    app.engine('html', require('ejs').renderFile, cons.swig);
    app.set('view engine', 'html');


    require('../application/telemedicine-routes/telemedicine-routes')(app);
    return app;
};
