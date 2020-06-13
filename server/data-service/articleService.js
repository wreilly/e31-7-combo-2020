/* HMM. NOT USED HERE. SEE ARTICLE MODEL
const mongoose = require('mongoose');
*/
const articleModelHereInService = require('../models/articleModel');

/* $$$$$$  TOC  $$$$$$$$$$$$$$$$$$$$
   $$$$  ARTICLE DATA SERVICE $$$$$$

***  API-only  ***
(not for Node/Express app)

- .get('/') ==> findAllArticles
- .get('/:id') ==> findArticleById
- .post('/') ==> saveArticle

 */

class articleService {

    /* **************************** */
    /* *** Find All Articles ****** */
    /* **************************** */

    static findAllArticles() {
        /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
        "Static methods aren't called on instances of the class. Instead, they're called on the class itself. These are often utility functions, such as functions to create or clone objects."
         */
        return articleModelHereInService.find()
            .then(
                (whatIGot) => { // all new2020articles!
                    // resolved
                    console.log('articleService resolved whatIGot[0]', whatIGot[0]);
                    return whatIGot;
                },
                (problemo) => {
                    console.log('Here in articleService - findAllArticles - Rejected Promise problemo: ', problemo)
                    throw Error('AllArticlesFindError ' + problemo);
                }
            ) // /.then()
            .catch(
                (err) => {
                    console.log('Here in articleService - findAllArticles - .catch err: ', err);
                }
            )
    } // /findAllArticles()

    /* **************************** */
    /* *** Find One Article, By ID *** */
    /* **************************** */
    static findArticleById(idPassedIn) {
        return articleModelHereInService.findById( idPassedIn )
            .then(
                (whatIGot) => {
                    // resolved
                    console.log('Article By ID - whatIGot ', whatIGot);
                    /*
                     {
  _id: 5af746cea7008520ae732e2c,
  articlePhotos: [ '"justsomestring"' ],
  articleUrl: 'myhttp',
  articleTitle: 'Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers',
  __v: 0
}
                     */

                    return whatIGot;
                },
                (problemo) => {
                    // rejected
                    console.log('Data Service findArticleById() problemo: ', problemo);
                }
            )
            .catch((err) => console.log('Data Service findArticleById() CATCH err ', err));
    } // /findArticleById()

    /* **************************** */
    /* ****** Save Article ******** */
    /* **************************** */

    static saveArticle(articleToSave) {
        console.log('Data Service: articleToSave: ', articleToSave);
        /*
        Data Service: articleToSave:  {
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1'
}
         */

        const articleForDatabase = new articleModelHereInService(articleToSave);
        articleForDatabase.save(function(err, articleConfirmationWeGot) {
            if (err) {
                console.log(err);
            } else {
                console.log('articleConfirmationWeGot ', articleConfirmationWeGot);
                /*
                articleConfirmationWeGot  {
  _id: 5ee4c5facc58cf6657c96c17,
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1',
  __v: 0
}
                 */
            }
        });


    } // /saveArticle()

} // /articleService

module.exports = articleService;
