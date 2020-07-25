/* HMM. NOT USED HERE. SEE ARTICLE MODEL
const mongoose = require('mongoose');
*/
const articleModelHereInService = require('../models/articleModel');

/* $$$$$$  TOC  $$$$$$$$$$$$$$$$$$$$
   $$$$  ARTICLE DATA SERVICE $$$$$$

***  API-only  ***
(not for Node/Express app)

- .get('/') ==> findAllArticles
- .get('/recent') ==> findArticleMostRecent
- .get('/:id') ==> findArticleById
- .put(':/id') ==> updateArticle
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
        console.log('Most Recent Article 2020');

        /*
        *****   DATE RANGE TEST ZONE  ***** :o)
         */
        console.log('Most Recent Article - HIJACKED for DATE RANGE ');
        // https://steveridout.github.io/mongo-object-time/
        // N.B. MONTHS ARE ZERO-BASED!  6 is July.
        const lowDate = new Date(2020, 5, 13, 0);
        console.log('lowDate ', lowDate);
        // lowDate  Tue Jul 14 2020 12:00:00 GMT-0400 (Eastern Daylight Time)
        console.log('typeof lowDate ', typeof lowDate); // object    ( ! )

        const highDate = new Date(2020, 5, 14, 8, 17);
        console.log('highDate ', highDate);
        // highDate  Wed Jul 15 2020 11:59:00 GMT-0400 (Eastern Daylight Time)

        function objectIdFromDate (myDate) {
            return Math.floor(myDate.getTime() / 1000).toString(16) + "0000000000000000";
        }

        const lowObjectId = objectIdFromDate(lowDate);
        console.log('lowObjectId ', lowObjectId);
        // 5f0dd6800000000000000000
        console.log('typeof lowObjectId ', typeof lowObjectId); // string   (of course)

        const highObjectId = objectIdFromDate(highDate);
        console.log('highObjectId ', highObjectId);
// 5f0f27c40000000000000000

/* NO. returns []  :o(
        return articleModelHereInService.find({ _id: { $gt: lowObjectId, $lt: highObjectId }})
*/
/* YES. returned [(30)] from July 14 to date...
        return articleModelHereInService.find({ _id: { $gt: lowObjectId }})
*/
/* YES. RANGE :o) returned e.g. [(16)] etc.
        return articleModelHereInService.find({$and: [{ _id: { $gt: lowObjectId }}, { _id: { $lt: highObjectId }}]})
*/
        /* Compare MongoDB SHELL
        MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.find({_id: {$lt: ObjectId("5f0dd6800000000000000000"), $gt: ObjectId("5f0d2dc00000000000000000") }}).count()
16
         */

/* YEP: PRETTY AWESOME
        return articleModelHereInService.find({$and: [{ _id: { $gt: lowObjectId }}, { _id: { $lt: highObjectId }}]})

 */
        /*
          *****   /DATE RANGE TEST ZONE  ***** :o)
        */


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


    /* ********************************* */
    /* *** Update Article   *********** */
    /* ********************************* */
    static updateArticle(idToUpdatePassedIn, articleDataToUpdatePassedIn) {
        console.log('Server. Service. UPDATE. ******** articleDataToUpdatePassedIn ', articleDataToUpdatePassedIn);

        /* Hmm. 2020 Doesn't like .findByIdAndUpdate(). Worked in 2018 ?
        Fixed by putting into app.js mongoose.connect(uri, {useFindAndModify: false})
        (node:8400) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
         */
        // DO NOT FORGET :::: 'return'   <<< YEESH
        return articleModelHereInService.findByIdAndUpdate(
            {_id: idToUpdatePassedIn},
            { $set: {
                    articleTitle: articleDataToUpdatePassedIn.articleTitle_name,
                    articleUrl: articleDataToUpdatePassedIn.articleUrl_name,
                }},
            { new: true }
            // Gets you the NEW, just-edited doc (not the orig one)
        )
            .then(
                (whatIGot) => {
                    console.log('Server. Service. UPDATE .then() whatIGot ', whatIGot); // Model (Mongoose)
                    console.log('Server. Service. UPDATE .then() whatIGot._doc ', whatIGot._doc); // Yeah the document: (Mongoose style ?)
                    /*
                    articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s EDITED OUT OF OFFICE WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "null"
__v: 0
_id: ObjectID
generationTime: (...)
id: Buffer(12) [90, 247, 70, 206, 167, 0, 133, 32, 174, 115, 46, 44]
                     */
                    return whatIGot._doc;
                }
            )
            .catch((err) => console.log('Service. Update. Catch err ', err));
    } // /updateArticle(id)


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


    /* ****************************** */
    /* ****** Delete Article ******** */
    /* ****** TODO BY DATE, DATE-RANGE *** */

    /* From CLIENT:
    /Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-e31-combo-2020/client/src/app/articles/article.service.ts

    * **************************************************
   *   DELETE (MANY) ARTICLES (BY DATE, DATE-RANGE) *
   **************************************************
 */
    /* https://steveridout.github.io/mongo-object-time/

    PRIMARY> db.newarticles.deleteMany({_id: {$lt: ObjectId("5f0e7f400000000000000000"), $gt: ObjectId("5f0dd6800000000000000000") }})
  { "acknowledged" : true, "deletedCount" : 6 }

  PRIMARY> db.newarticles.find({_id: {$lt: ObjectId("5f0e7f400000000000000000"), $gt: ObjectId("5f0dd6800000000000000000") }}).count()
  6 documents
  July 14th P.M. from noon to midnight
     */


} // /articleService

module.exports = articleService;
