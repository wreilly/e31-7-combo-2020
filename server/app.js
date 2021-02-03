require('dotenv').config();

// WR__ 2021
const myAppAndHostnamePseudoModule = {};
/*
Above is v. kludgy thing-y so I can do
modules.export of more than just the Express app itself.
I wish to use the "dotenv" .env file
to hold environment-specific parameters re:
HOSTNAME_IN_ENV=0.0.0.0
PORT_IN_ENV=8089
# PORT_IN_ENV=8080 // @ AWS
# HOSTNAME_IN_ENV=ec2-100-26-170-247.compute-1.amazonaws.com

See bottom of file for more info.
 */

const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');


/* Do I need? T.B.D.
app.use(bodyParser.urlencoded({
    extended: false
}));
*/

// For REST API (POST, req.body)
app.use(bodyParser.json());

const mongoose = require('mongoose');

const uri_to_cscie31_db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterwr03-n783b.mongodb.net/test?retryWrites=true`;

mongoose.connect(
    uri_to_cscie31_db,
    {
        dbName: 'cscie31',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
    /* re: above 2 new lines in 2020 (not 2018)
    - useNewUrlParser:
    DeprecationWarning: current URL string parser is deprecated

    - useUnifiedTopology:
    DeprecationWarning: current Server Discovery and Monitoring engine is deprecated
     */
    /* 2020 more deprecation
    re: findByIdAndUpdate() etc.
    https://mongoosejs.com/docs/deprecations.html#findandmodify
    useFindAndModify: false
     */
    )
    .then(
        // resolve
        (anythingWeGot) => {
            console.log('Happy database: { dbName: \'cscie31\' }');
            console.log('anythingWeGot.connections[0].host ?\n', anythingWeGot.connections[0].host); // << YEAH!
            // clusterwr03-shard-00-00-n783b.mongodb.net
            // console.log('anythingWeGot.Mongoose.connections[0].host ? ', anythingWeGot.Mongoose.connections[0].host); // << NOPE
            // console.log('anythingWeGot ? ', anythingWeGot);
            /* Big Ol' Object:
            anythingWeGot ?  Mongoose {
  connections: [
    NativeConnection {
      base: [Circular],
      collections: {},
      models: {},
       ...
             _hasOpened: true,
      plugins: [],
      id: 0,
      _listening: false,
      _connectionOptions: [Object],
      '$dbName': 'cscie31',
      client: [MongoClient],
      '$initialConnection': [Promise],
      name: 'cscie31',
      host: 'clusterwr03-shard-00-00-n783b.mongodb.net',
      port: 27017,
      user: 'wr_mongodb_admin03',
      pass: 'mongodb_admin03',
      db: [Db]
    } ...
             */
        },
        // reject
        (err) => {
            console.log('Unhappy database. Failed db connection ', err);
        }
    );


/* T.B.D.
Q. Can we avoid doing server app U/I mostly? at all? Just API ? T.B.D.
A. Well, kinda useful to just have /index.html to begin. We shall see past that...
*/
app.use('/static', express.static(path.join( __dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join( __dirname, 'views'));
/* */

const apiArticlesRouterHere = require('./routes/api/api-articles');

app.use('/api/v1/articles', apiArticlesRouterHere);

// Catch-All (of sorts ?)
/*
// Yeah works but doesn't "catch" /foobar
app.get('/', (req, res, next) => {...

// Catches /foobar, but doesn't redirect to /   O well.
app.get('/*', (req, res, next) => {...
*/

app.get('/*', (req, res, next) => {
    console.log('res.render index home page');
    res.render('index');
});

const portFromEnv = `${process.env.PORT_IN_ENV}`;
// e.g. 8089 -- OR -- 8080 (AWS)
const hostnameFromEnv = `${process.env.HOSTNAME_IN_ENV}`;
// e.g. 0.0.0.0  -- OR -- 'ec2-100-26-170-247.compute-1.amazonaws.com'

myAppAndHostnamePseudoModule.myPort = portFromEnv;
myAppAndHostnamePseudoModule.myHostname = hostnameFromEnv;
myAppAndHostnamePseudoModule.myApp = app;

module.exports = myAppAndHostnamePseudoModule;
// WR__ 2021 module.exports = app;
