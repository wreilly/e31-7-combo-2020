const express = require('express');
const apiArticlesRouter = express.Router();

const apiArticleControllerHereInApi = require('.././../controllers/api/api-articleController');

/* ***********  TOC  ********
   *****   API ROUTER  ******
- GET '/' ==> '/api/v1/articles/'
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


apiArticlesRouter.get('/',
    function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
})

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

apiArticlesRouter.post('/',
    function (req, res, next) {

        console.log('REST API ROUTER POST / req.body: ', req.body);

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
