const express = require('express');
const apiArticlesRouter = express.Router();

const apiArticleControllerHereInApi = require('.././../controllers/api/api-articleController');

// CORS-enable our API Server RESPONSE HEADERS:
apiArticlesRouter.use(
    (req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers'
        });
        // PRE-FLIGHT check:
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        next();
    }
);

/* ***********  TO BEGIN  ********
- GET '/' ==> '/api/v1/articles/'
- GET '/:id' ==> '/api/v1/articles/123456'

"Skinny Router" here - fire and forget
Go see "Fat Controller" for return value etc.
 */
apiArticlesRouter.get(
    '/',
    function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
})

apiArticlesRouter.get(
    '/:idHere',
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
        apiArticleControllerHereInApi.apiCreateArticle(req, res, next);
    }
) // /POST '/'

module.exports = apiArticlesRouter;
