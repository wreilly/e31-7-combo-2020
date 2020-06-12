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

"Skinny Router" here - fire and forget
Go see "Fat Controller" for return value etc.
 */
apiArticlesRouter.get(
    '/',
    function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
})

module.exports = apiArticlesRouter;
