const express = require('express');
const apiArticlesRouter = express.Router();

/* ######################################################### */
/* ###############  MULTER HERE IN ROUTER, SIMPLY ########## */
/* ######################################################### */
// See extensive notes in 2018 server ...

const myMulter = require('multer');
const myMkdirp = require('mkdirp');

const myDiskStorage = myMulter.diskStorage({
    destination: myDestinationFunction,
    filename: myFilenameFunction
});

const myPhotosUploadMulter = myMulter({
    storage: myDiskStorage,
    fileFilter: myFileFilterFunction
});

function myDestinationFunction(req, file, callback) {
    const destination = 'public/img';

    myMkdirp(destination, function(err) {
        if(err) {
            console.log('Dang. myMkdirp failed. ', err);
        } else {
            console.log('Great. myMkdirp destination is: ', destination);
            callback(null, destination);
        }
    })
}

function myFilenameFunction(req, file, callback) {
    console.log('Router. Multer. myFilenameFunction file.originalname: ', file.originalname);
    callback(null, `sometimes__${Date.now()}_${file.originalname}`);
    // callback(null, 'sometimes__' + Date.now() + '_' + file.originalname);
}

function myFileFilterFunction(req, file, callback) {
    callback(null, true); // TODO filter on .JPG, .PNG etc. T.B.D. (sigh)
}

/* ######################################################### */
/* ###############  /MULTER HERE IN ROUTER, SIMPLY ########## */
/* ######################################################### */

const apiArticleControllerHereInApi = require('.././../controllers/api/api-articleController');

/* ***********  TOC  ********
   *****   API ROUTER  ******
- GET '/' ==> '/api/v1/articles/'
- GET '/recent' ==> '/api/v1/articles/recent' // 1, for now. NEW.
- GET '/:id' ==> '/api/v1/articles/123456'
- POST '/'  ==> '/api/v1/articles'
- DELETE '/:id' ==> '/api/v1/articles/123456'

"Skinny Router" here - fire and forget
Go see "Fat Controller" for return value etc.
 */

// CORS-enable our API Server RESPONSE HEADERS: ( ? )
apiArticlesRouter.use(
    (req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        /* Above, last line, HAD (I removed, looked wrong):
        ', Access-Control-Allow-Headers'
         */
        // PRE-FLIGHT check:
        if (req.method === 'OPTIONS') {
            console.log('999 We got an OPTIONS Request Method! req.toString() ', req.toString());
            return res.status(200).end();
        }
        next();
    }
);

/* ************************************************** */
/* ******** GET '/api/v1/articles/recent' ************ */
/* ************************************************** */
apiArticlesRouter.get('/recent',
    function (req, res, next) {
        console.log('API Router 2020 - getArticleMostRecent');

        apiArticleControllerHereInApi.apiGetArticleMostRecent(req, res, next);
        /* N.B.
        - With Express server coding, we
        simply pass the usual:
          req, res, next
         */
    }
) // /GET '/recent'  1, for now.


/* ************************************************** */
/* ******** GET '/api/v1/articles/12345' ************ */
/* ************************************************** */
apiArticlesRouter.get('/:idHere',
    function (req, res, next) {
        console.log('API Router - getArticleById - idHere is: ', req.params.idHere);
        // YES: 5af746cea7008520ae732e2c

        apiArticleControllerHereInApi.apiGetArticleById(req, res, next);
        /* N.B.
        - With Express server coding, we
        simply pass the usual:
          req, res, next
        - We do NOT pass the explicit "idHere". No.
        - That "ID" will be gotten off of
        the req.params.idHere
         */
    }
) // /GET '/:id'


/* ************************************************** */
/* ******** GET '/api/v1/articles/' ************ */
/* ************************************************** */
apiArticlesRouter.get('/',
    function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
})



/* ************************************************** */
/* ******** POST '/api/v1/articles/'  ************ */
/* ************************************************** */
apiArticlesRouter.post(
    '/',

    /*
    TIME FOR MULTER HERE IN 2020!
    Below line just handles text form field data.
    No handling of FILES; see elsewhere for that.

    William, do NOT forget to "invoke()" the
    damned thing.
     */
    // myPhotosUploadMulter.array, // << !! WRONG !!
    myPhotosUploadMulter.array(),


    function (req, res, next) {

        console.log('REST API ROUTER POST / req.body: ', req.body);
        /*
        REST API ROUTER POST / req.body:  [Object: null prototype] {
  articleTitle_name: 'Will the REAL 2020 pls what have you',
  articleUrl_name: 'http://nytimes.com/oboywhatdoeslogginglooklike'
}
         */

        apiArticleControllerHereInApi.apiCreateArticle(req, res, next);
    }
) // /POST '/'

apiArticlesRouter.delete('/:idToDeleteInRouter',
    function (req, res, next) {
        console.log('Router: Delete - about to. id: ', req.params.idToDeleteInRouter);
        /* OK:
        Router: Delete - about to. id:  5ee4c5facc58cf6657c96c17
         */

        apiArticleControllerHereInApi.apiDeleteArticle(req, res, next);
    }
) // /DELETE '/:id'

module.exports = apiArticlesRouter;
