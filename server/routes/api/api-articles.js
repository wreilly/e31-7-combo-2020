const express = require('express');
const apiArticlesRouter = express.Router();

const middlewareTrimUrlHere = require('../../middleware/trim-url-is-all');

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
- GET '/recent' ==> '/api/v1/articles/recent' // 1, for now. NEW.
- GET '/api/v1/articles/paginated?page=1&pagesize=10' // << NEW: *PAGINATION*
- GET '/api/v1/articles/more?offset=40' // << NEW: *LOAD MORE*
- GET '/:id' ==> '/api/v1/articles/123456'
- GET '/' ==> '/api/v1/articles/' // << ALL Articles
- PUT '/:id' ==> '/api/v1/articles/123456'
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
            // [object Object]

            return res.status(200).end();
        }
        next();
    }
);

/* ************************************************** */
/* ******** GET '/api/v1/articles/recent' ************ */
/* ************************************************** */
// This /articles/recent must go BEFORE the /articles/:idHere route !!
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
/* ******** GET '/api/v1/articles/paginated?page=0&pagesize=10' ************ */
/* ************************************************** */
// This /articles/paginated must go BEFORE the /articles/:idHere route !!
/* PAGINATION - See also (of course) api-articleController.js and articleService.js
$ pwd
/Users/william.reilly/dev/MEAN/Udemy-MEAN-MaxS/07-Pagination/pagination-02-finished/backend/routes/posts.js
 */
apiArticlesRouter.get('/paginated', // << ? Q. Can that also be '' ? A. IDK.
    function(req, res, next) {
        const pageNumber = +req.query.page; // '+' makes string to number
        const pageSize = +req.query.pagesize; // ditto

        apiArticleControllerHereInApi.apiGetAllArticlesPaginated(req, res, next, pageNumber, pageSize);
    })

/* ************************************************** */
/* ******** GET '/api/v1/articles/more?offset=40' ************ */
/* ************************************************** */
// This /articles/more must (also) go BEFORE the /articles/:idHere route !!
/* LOAD MORE - See also (of course) api-articleController.js and articleService.js
Note: - re: offset numbers in the URL: We "hide" from end-users
        the "1-based" (21-40 is the second 20) mode.
        We instead present them the sort of "easy" offsets of
        easy even numbers: 20, 40, 60...
        As opposed to:     21, 41, 61...
        - Note that, behind-the-scenes of course, the
        inescapable zero-based array numbering (0-19 is first 20)
        is going on, giving us that: 0, 20, 40, 60.
        - Finally, note that we omit the first 0 from initial URL,
        (keeping things easy-peasy).

        Yes, pageSize is hard-coded. Currently at 20 articles/page.
 */
apiArticlesRouter.get('/more',
    function(req, res, next) {
        const offsetNumber = +req.query.offset; // '+' makes string to number
        const pageSize = 20; // hard-coded. 20 articles per "Load More" page.
        /* // HARD-CODED. Matches FE
        src/app/articles/articles-categorized/articles-categorized.component.ts:23
          offsetPageSize = 20;
         */

       // console.log('API /more offset is: ', offsetNumber); // << YES. e.g. 40

        apiArticleControllerHereInApi.apiGetAllArticlesLoadMore(req, res, next, offsetNumber, pageSize);
    })


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
/* ** NEW FOR PAGINATION (below) **
Q. Appears I must REMOVE (get out of the way) this default endpoint of '/'
A. Hmm - don't know. Let's PUT IT BACK IN.
*/

apiArticlesRouter.get('/',
    function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
})



/* ************************************************** */
/* ******** PUT '/api/v1/articles/12345' ************ */
/* ************************************************** */
apiArticlesRouter.put(
    '/:idToEditHere',
    myPhotosUploadMulter.array(), // << Right
    // MIDDLEWARE !
    middlewareTrimUrlHere.myMiddlewareTrimUrlFunction,
    function (req, res, next) {
        console.log('REST API ROUTER PUT /:idToEditHere req.body: ', req.body);
        /* YEPpers
        REST API ROUTER PUT /:idToEditHere req.body:  [Object: null prototype] {
  articleTitle_name: 'Trump’s NORBIE WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers',
  articleUrl_name: 'null',
  articleCategory_name: 'News'
}
         */

        apiArticleControllerHereInApi.apiUpdateArticle(req, res, next);
    }
) // /PUT '/:id'


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
    myPhotosUploadMulter.array(), // << Right

    // MIDDLEWARE !
    middlewareTrimUrlHere.myMiddlewareTrimUrlFunction,


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
