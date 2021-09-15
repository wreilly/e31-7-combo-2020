require('dotenv').config();

// WR__ 2021
const myComboAppAndHostnamePseudoModule = {};
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
const appCombo = express();
const path = require('path');

/* 2021-09-15 Note
Well, here we finally are. Ready to do the Combo for this good old
MEAN stack app of "Some Times 2020", to get it up to
"PROD" @ AWS wreilly2020

See NOTES in
/Users/william.reilly/dev/AWS/wreilly2020-2020-aws/NOTES-AWS-wreilly2020.txt
 */

/* 2020-06-23 Note

For the 2020 Server (and Combo of Server + Client),
I here for now have put
    ** ON HOLD **
any further work on this "app-combo.js"

Q. Why?
A. Because the "combo" is for the Client after a BUILD to the /DIST directory.
I am very much still in DEVELOPMENT (not BUILD) for the 2020 Client.

Be sure to see this file for fuller details on how Combo gets used:

/Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/server/app-combo.js
 */

/*
 N.B.
 With new "combo" proxy + client Git repository,
 this path now goes UP and OUT of
 the Express /server directory,
 to get over and then down to the
 Angular Client /client/dist directory.

 app.use('/', express.static('../client/dist'));
 */

const client_dist_dir_done_right = path.join(__dirname, '..', 'client', 'dist');

/* Q. Can both work, when doing Combo?
1) '/' gets Angular app index.html ?
2) '/' can (also?) ? serve up Express basic index page? << would seem NOT

Hmm.
http://0.0.0.0:8089/  << page refresh does work ok (stays on Angular app)
http://0.0.0.0:8089/articles  >> page refresh FAILS. Goes to Express app index page
 */
appCombo.use('/', express.static(client_dist_dir_done_right));

/* If I just take this out ? << Hmm, did *NOT* correct the above.
appCombo.use('/static', express.static(path.join( __dirname, 'public'))); // << '/static/' ( ?? )
*/

appCombo.set('view engine', 'pug');
appCombo.set('views', path.join( __dirname, 'views'));

const bodyParser = require('body-parser');

/* Do I need? T.B.D.
app.use(bodyParser.urlencoded({
    extended: false
}));
*/

// For REST API (POST, req.body)
appCombo.use(bodyParser.json());

const mongoose = require('mongoose');

const uri_to_cscie31_db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterwr03-n783b.mongodb.net/test?retryWrites=true`;

mongoose.connect(
    uri_to_cscie31_db,
    {
        dbName: 'cscie31',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }).then(
        // resolve
        (anythingWeGot) => {
            console.log('Happy database: { dbName: \'cscie31\' }');
            console.log('anythingWeGot.connections[0].host ?\n', anythingWeGot.connections[0].host);
        },
        // reject
        (err) => {
            console.log('Unhappy database. Failed db connection ', err);
        }
); // /mongoose.connect()

const apiArticlesRouterHere = require('./routes/api/api-articles');

appCombo.use('/api/v1/articles', apiArticlesRouterHere);

// Catch-All (of sorts ?)

appCombo.get('/*', (req, res, next) => {

/* No! We don't want "render()" of an Express 'view' etc.  No.
console.log('res.render index home page');
    res.render('index');
*/
    // Instead we want to send the file at this path:  ../client/dist/index.html << The Angular app index page
    console.log('res.sendFile of Angular app index.html page');
    res.sendFile('index.html', {root: client_dist_dir_done_right});
});

const portFromEnv = `${process.env.PORT_IN_ENV}`;
// e.g. 8089 -- OR -- 8080 (AWS)
const hostnameFromEnv = `${process.env.HOSTNAME_IN_ENV}`;
// e.g. 0.0.0.0  -- OR -- 'ec2-100-26-170-247.compute-1.amazonaws.com'

myComboAppAndHostnamePseudoModule.myPort = portFromEnv;
myComboAppAndHostnamePseudoModule.myHostname = hostnameFromEnv;
myComboAppAndHostnamePseudoModule.myApp = appCombo;

module.exports = myComboAppAndHostnamePseudoModule;
// WR__ 2021 module.exports = app;
