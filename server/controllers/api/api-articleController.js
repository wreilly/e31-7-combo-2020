const articleDataServiceHereInApiController = require('../../data-service/articleService');

const apiArticleController = {};

/* **********  TOC  *************
   ********  API CONTROLLER  ****
- GET '/' = apiGetAllArticles
- GET '/:id' = apiGetArticleById
- POST '/' = apiCreateArticle

 */

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController
          .apiGetAllArticles   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetAllArticles = function (req, res, next) {
    articleDataServiceHereInApiController.findAllArticles()
        .then(
            (whatIGot) => {
                // resolved
                console.log('1. Controller getAllArticles - whatIGot[0] (from data service) ', whatIGot[0]);
                /*
                {
  _id: 5af746cea7008520ae732e2c,
  articlePhotos: [ '"justsomestring"' ],
  articleUrl: 'myhttp',
  articleTitle: 'Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers',
  __v: 0
}
                 */

                const strungWhatIGot = JSON.stringify(whatIGot);
                console.log('2. strungWhatIGot for 500... ', strungWhatIGot.slice(0,500));
                /*
                 [
                 {"_id":"5af746cea7008520ae732e2c","articlePhotos":["\"justsomestring\""],"articleUrl":"myhttp","articleTitle":"Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers","__v":0},
                 {"_id":"5af83649f2fffa14c4a22cd7","articlePhotos":["[\"sometimes__1526216263665_051218krugman1-jumbo.png\",\"sometimes__1526216263667_051218krugman2-superJumbo.png\",\"sometimes__1526216263668_051218krugman3-superJumbo.png\"]"],"articleUrl":"https://www.nytimes.com/2018/05/12/opinion/whats-good-for-pharma-isnt-good-for-america-wonkish.html","articleTitle":"What’s Less Edit URL We Be EdiTiNG MORE toss it REACTIVELY Good for Pharma Isn’t Good for America (Wonkish)","__v":0},
                 ...]
                 */

                // Send data back in Response to API Request
                // res.send(whatIGot); // << WORKS FINE TOO
                res.send(JSON.stringify(whatIGot)); // << WORKS FINE
            },
            (problemo) => {
                console.log('problemo in rejected Promise for \'/\' GET all articles ', problemo)
            }
        )
        .catch( (err) => console.log('Err in Catch API Controller for GET all articles ', err));
} // /.apiGetAllArticles()


/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController
          .apiGetArticleById   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetArticleById = function (req, res, next) {
    const idThisTime = req.params.idHere;
    console.log('API Controller - getArticleById - idHere is: ', req.params.idHere);
    // YES: 5af746cea7008520ae732e2c

    console.log('idThisTime is ', idThisTime);
    // YES: 5af746cea7008520ae732e2c

    articleDataServiceHereInApiController.findArticleById(idThisTime)
        .then(
            (whatIGot) => {
                // resolved
                console.log('Controller - resolved Promise: articleById: whatIGot: ', whatIGot);
                /*
                  {
  _id: 5af83649f2fffa14c4a22cd7,
  articlePhotos: [
    '["sometimes__1526216263665_051218krugman1-jumbo.png","sometimes__1526216263667_051218krugman2-superJumbo.png","sometimes__1526216263668_051218krugman3-superJumbo.png"]'
  ],
  articleUrl: 'https://www.nytimes.com/2018/05/12/opinion/whats-good-for-pharma-isnt-good-for-america-wonkish.html',
  articleTitle: 'What’s Less Edit URL We Be EdiTiNG MORE toss it REACTIVELY Good for Pharma Isn’t Good for America (Wonkish)',
  __v: 0
}

                 */

                console.log('Controller - resolved Promise: articleById: JSON.stringify(whatIGot) ', JSON.stringify(whatIGot));
                /*
                  {"_id":"5af83649f2fffa14c4a22cd7","articlePhotos":["[\"sometimes__1526216263665_051218krugman1-jumbo.png\",\"sometimes__1526216263667_051218krugman2-superJumbo.png\",\"sometimes__1526216263668_051218krugman3-superJumbo.png\"]"],"articleUrl":"https://www.nytimes.com/2018/05/12/opinion/whats-good-for-pharma-isnt-good-for-america-wonkish.html","articleTitle":"What’s Less Edit URL We Be EdiTiNG MORE toss it REACTIVELY Good for Pharma Isn’t Good for America (Wonkish)","__v":0}
                 */

                // Send data back in Response to API Request
                res.send(whatIGot); // Hmm. Seems to WORK FINE, TOO ( ? )
                // res.send(JSON.stringify(whatIGot)); // << WORKS FINE :)
            },
            (problemo) => {
                // rejected
                console.log('Controller - rejected Promise ', problemo);
            }
        )
        .catch((err) => console.log('Controller -getArticleById() .catch err: ', err));

} // /.apiGetArticleById()


/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController
          .apiCreateArticle   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiCreateArticle = function (req, res, next) {

    console.log('********************');
    console.log('Controller: createArticle req ', req);
    /*
    Controller: createArticle req  IncomingMessage {
  _readableState: ReadableState {
    objectMode: false,
    highWaterMark: 16384,
    buffer: BufferList { head: null, tail: null, length: 0 },
    length: 0,
...
headers: {
    host: '0.0.0.0:8089',
    'user-agent': 'insomnia/2020.2.1',
    'content-type': 'application/json',
    accept: '* /*',
    'content-length': '94'
},
    ...
      url: '/',
  method: 'POST',
  statusCode: null,
  statusMessage: null,
  ...
    next: [Function: next],
  baseUrl: '/api/v1/articles',
  originalUrl: '/api/v1/articles',
  _parsedUrl: Url {
...
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: '/',
    path: '/',
    href: '/',
    _raw: '/'
  },
  params: {},
  query: {},
  ...
    body: {
    articleUrl_name: 'https://nytimes.com',
    articleTitle_name: 'Headline Today Be xyz1'
  },
  _body: true,
  length: undefined,
    route: Route { path: '/', stack: [ [Layer] ], methods: { post: true } },
  [Symbol(kCapture)]: false
  }
     */
    console.log('********************');
    console.log('Controller: createArticle req.body ', req.body); // << undefined  :o(
    /* Now Happy :o)  (now using BodyParser in app.js)
    Controller: createArticle req.body  {
  articleUrl_name: 'https://nytimes.com',
  articleTitle_name: 'Headline Today Be xyz1'
}
     */
    console.log('********************');

    const articleToSave = {};
    articleToSave.articleUrl = req.body.articleUrl_name;
    articleToSave.articleTitle = req.body.articleTitle_name;

    articleDataServiceHereInApiController.saveArticle(articleToSave)
        .then(
            (whatIGot) => {
                // resolved
                console.log('Controller: createArticle resolved whatIGot ', whatIGot);
            },
            (problemo) => {
                // rejected
                console.log('Controller: createArticle rejected problemo ', problemo);
            }
        )
        .catch(
            (err) => {
                console.log('Controller: createArticle .catch err ', err);
            }
        );

} // /.apiCreateArticle()

module.exports = apiArticleController;
