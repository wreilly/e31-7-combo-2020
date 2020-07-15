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
- .delete('/:id') ==> deleteArticle

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

                    /* Let's STOP logging this monster.
                    It's the WHOLE MODEL (Too Much).
                                            console.log('articleService runModelPromises resolved whatIGot[0]', whatIGot[0])
                    */
                    console.log('articleService. finaAllArticles. resolved whatIGot[0].articleTitle', whatIGot[0].articleTitle);
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
    /* *** Find MOST RECENTLY Added Article *** */
    /* **************************** */
    static findArticleMostRecent() {
        return articleModelHereInService.find({}).sort({_id:-1}).limit(1)
            .then(
                (whatIGot) => {
                    // resolved
                    console.log('Most Recent Article - whatIGot ', whatIGot);
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
                    console.log('Data Service findArticleMostRecent() problemo: ', problemo);
                }
            )
            .catch((err) => console.log('Data Service findArticleMostRecent() CATCH err ', err));
    } // /findArticleMostRecent()


    /* **************************** */
    /* ****** Save Article ******** */
    /* **************************** */

    static saveArticle(articleToSave) {
        console.log('Article Data Service: articleToSave: ', articleToSave);
        /*
        Data Service: articleToSave:  {
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1'
}
         */

        const articleForDatabase = new articleModelHereInService(articleToSave);

        /*
**** !!!!  Don't Forget!!! ***
* You need *RETURN* at top here!
 */
        return articleForDatabase.save()
            .then(
                (articleConfirmationWeGot) => {
                console.log('Article Service. Save. articleConfirmationWeGot ', articleConfirmationWeGot);
                /*
                articleConfirmationWeGot  {
  _id: 5ee4c5facc58cf6657c96c17,
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1',
  __v: 0
}
                 */
                return articleConfirmationWeGot;
            },
                (problemo) => {
                    // rejected
                    console.log('articleService SAVE rejected Promise from Mongoose .save() ', problemo)
                    // E.g. { ValidationError: Newarticle validation failed: articleUrl: Path `articleUrl` is required.
                    throw new Error(`articleServiceSAVERejected: ${problemo}`);
                })
            .catch(
                (err) => {
                    console.log('.catch err ', err);
                }
        );

    } // /saveArticle()

    /* **************************** */
    /* ****** Delete Article ****** */
    /* **************************** */
    static deleteArticle(idToDeleteInService) {
        /*
        **** !!!!  Don't Forget!!! ***
        * You need *RETURN* at top here!
         */
        return articleModelHereInService.findByIdAndRemove(idToDeleteInService)
            .then(
                (whatIGotFromDeletion) => {
                    // resolved
                    console.log('Service: whatIGotFromDeletion ', whatIGotFromDeletion);
                    /*
                    Service: whatIGotFromDeletion  {
  _id: 5ee4c5facc58cf6657c96c17,
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1',
  __v: 0
}
                     */

                    return whatIGotFromDeletion;
                },
                (problemo) => {
                    // rejected
                    console.log('Service: problemo rejected ', problemo);
                }
            )
            .catch((err) => console.log('Service .catch err ', err));
} // /deleteArticle()

} // /articleService

module.exports = articleService;
