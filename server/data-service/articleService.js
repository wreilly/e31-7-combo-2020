/* HMM. NOT USED HERE. SEE ARTICLE MODEL
const mongoose = require('mongoose');
*/
const articleModelHereInService = require('../models/articleModel');

/* $$$$$$  TOC  $$$$$$$$$$$$$$$$$$$$
   $$$$  ARTICLE DATA SERVICE $$$$$$

***  API-only  ***
(not for Node/Express app)

- .get('/') ==> findAllArticles
- .get('/paginated') ==> findAllArticlesPaginated
- .get('/more') ==> findAllArticlesLoadMore
- .get('/recent') ==> findArticleMostRecent
- .get('/:id') ==> findArticleById
- .put('/:id') ==> updateArticle
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
        return articleModelHereInService.find({}).sort({_id: -1})
            /* WORKS. H'rrah.
            This new line (above) gets us REVERSE CHRONOLOGICAL SORT.
            NEWEST (most recently added) items at TOP. Makes more sense. :o)
             */

            /* YES. WORKS. LOVELY.
This line (below) is super-duper basic default ".find()".
Returns items in "natural" order = order in which they were added.
Top/First is Oldest/First-Entered.

        return articleModelHereInService.find()
*/
            .then(
                (whatIGot) => { // all new2020articles!
                    // resolved

                    /* Let's STOP logging this monster.
                    It's the WHOLE MODEL (Too Much).
                                            console.log('articleService runModelPromises resolved whatIGot[0]', whatIGot[0])
                    */
                    console.log('articleService. findAllArticles. resolved whatIGot[0].articleTitle', whatIGot[0].articleTitle);
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
    /* *** Find All Articles Paginated ****** */
    /* **************************** */

    static findAllArticlesPaginated(pageNumber, pageSize) {
        /* Help from Max:
        /Users/william.reilly/dev/MEAN/Udemy-MEAN-MaxS/07-Pagination/pagination-02-finished/backend/routes/posts.js
         */
        let fetchedArticles; // [] of Articles
        return articleModelHereInService.find({})
            .sort({_id: -1})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .then(
                (whatIGot) => { // "pageSize" # [] of new2020articles!
                    // resolved
                    console.log('articleService. findAllArticles. resolved whatIGot[0].articleTitle', whatIGot[0].articleTitle);

                    fetchedArticles = whatIGot; // whamma-jamma

                    return articleModelHereInService.countDocuments();
                    // Very handy. Model can get you the count. Nice.
                    // Above line drops "countOfAllArticlesInCollection'
                    // to the next ".then()"
                    /* Hah!  ".count()" no more. Now .countDocuments(). OK.
                    "DeprecationWarning: collection.count is deprecated, and will be removed in a future version. Use Collection.countDocuments or Collection.estimatedDocumentCount instead"
                     */

                    // return whatIGot; // << WAS (direct back to Controller)
                },
                (problemo) => {
                    console.log('Here in articleService - findAllArticlesPaginated - Rejected Promise problemo: ', problemo)
                    throw Error('AllArticlesFindPaginatedError ' + problemo);
                }
            ) // /.then() 1st
            .then(
                (countOfAllArticlesInCollection) => {

                    return {
                        message: "(Paginated) Articles fetched successfully. Total count in Collection is " + countOfAllArticlesInCollection + ".",
                        articlesPaginated: fetchedArticles,
                        maxArticles: countOfAllArticlesInCollection,
                    }

/*
                    return fetchedArticles; // SUPER-TEMPORARY!
*/
                }
            ) // /.then() 2nd
            .catch(
                (err) => {
                    console.log('Here in articleService - findAllArticlesPaginated - .catch err: ', err);
                }
            )
    } // /findAllArticlesPaginated()


    /* **************************** */
    /* *** Find All Articles LoadMore ****** */
    /* **************************** */

    static findAllArticlesLoadMore(offsetNumber, pageSize) {
        let fetchedArticles; // [] of Articles
        return articleModelHereInService.find({})
            .sort({_id: -1})
            // .skip(pageSize * (offsetNumber - 1)) // << Hah! wrong math man.
            // .skip(offsetNumber - 1) // << wrong too. MongoError: Skip value must be non-negative, but received: -1
            // .skip(offsetNumber) // Hah, encore! No. No skipping!
            /*
            Boys and girls, we want to get ALL the articles, up to the LoadMore limit.
            We do NOT want to "skip" the first, whatever, 20, 40. No.
            Always GET from 0 (first, most recent), on up to LoadMore present
            limit (be that 20, 40, etc.).
             // */
            // .limit(pageSize) // << No. Worked fine w. above "skip" biz, but not what we want. Thx.
            .limit(offsetNumber) //  That ought to be the magic. Sheesh.
            // N.B. MongoDB limit(0) is same as NO limit. o la!
            .then(
                (whatIGot) => { // "pageSize" # [] of new2020articles!
                    // resolved
                    console.log('articleService. findAllArticles. resolved whatIGot[0].articleTitle', whatIGot[0].articleTitle);

                    fetchedArticles = whatIGot; // whamma-jamma

                    return articleModelHereInService.countDocuments();
                    // Very handy. Model can get you the count. Nice.
                    // Above line passes the
                    // "countOfAllArticlesInCollection'
                    // figure/number on to the next ".then()", below.
                    /* Hah!  ".count()" no more. Now .countDocuments(). OK.
                    "DeprecationWarning: collection.count is deprecated, and will be removed in a future version. Use Collection.countDocuments or Collection.estimatedDocumentCount instead"
                     */

                    // return whatIGot; // << WAS (direct back to Controller)
                },
                (problemo) => {
                    console.log('Here in articleService - findAllArticlesLoadMore - Rejected Promise problemo: ', problemo)
                    throw Error('AllArticlesFindLoadMoreError ' + problemo);
                }
            ) // /.then() 1st
            .then(
                (countOfAllArticlesInCollection) => {

                    return {
                        message: "(Load More) Articles fetched successfully. Total count in Collection is " + countOfAllArticlesInCollection + ".",
                        articlesLoadMore: fetchedArticles,
                        maxArticles: countOfAllArticlesInCollection,
                    }

                }
            ) // /.then() 2nd
            .catch(
                (err) => {
                    console.log('Here in articleService - findAllArticlesLoadMore - .catch err: ', err);
                }
            )
    } // /findAllArticlesLoadMore()



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
                    // CATEGORY TIME!
                    articleCategory: articleDataToUpdatePassedIn.articleCategory_name,
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
        https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
        Returns (MongoosE) "Query". Hmm.
        (Better if I supply a Callback, than using ".then()"
        on this sort of pseudo-Promise that Mongoose provides.
        The Callback (in Node.js) lets me get back both:
        (err, document)
        Right now with .then() I am (apparently?) getting
        back just the (err) (which is null). Hmmph.
*/

        /* PROMISE STYLE (Works - but doesn't get back the just-deleted document. hmmph.) */
        /* *** !!!!  Don't Forget!!! ***
        * You need *RETURN* at top here!
         */
/*
        return articleModelHereInService.findByIdAndRemove(idToDeleteInService)
            .then(
                (whatIGotFromDeletion) => {
                    // resolved
                    console.log('Service: PROMISE whatIGotFromDeletion from DELETE (should be empty document : null) is: ', whatIGotFromDeletion); // << Yes. null
                    /!* ?? hmm. earlier.
                    Service: whatIGotFromDeletion  {
  _id: 5ee4c5facc58cf6657c96c17,
  articleUrl: 'https://nytimes.com',
  articleTitle: 'Headline Today Be xyz1',
  __v: 0
}
                     *!/

                    return whatIGotFromDeletion;
                },
                (problemo) => {
                    // rejected
                    console.log('Service: problemo rejected ', problemo);
                }
            )
            .catch((err) => console.log('Service .catch err ', err));
*/


        /*  CALLBACK STYLE  (Works) */

                return articleModelHereInService.findByIdAndRemove(idToDeleteInService, function (err, returnedDocument) {
                    // callback
                    console.log('CALLBACK returnedDocument from DELETE is: ', returnedDocument) // null (?) << again! wtf
                    /* (Better (?))
                    Mongoose model ....
                    model {$__: InternalCache, isNew: false, ...
                     */

                    if (!returnedDocument) {
                        console.log('articleService Delete  !returnedDocument in CALLBACK. hmm. And ERR is: ', err); // null (?)
                        return(returnedDocument) // ?
                    } else {
                        console.log('articleService Delete  !returnedDocument in CALLBACK returnedDocument is (for some reason) NOT empty: Bueno ? returnedDocument is: ', returnedDocument)
                        /* (Better (?))
                    Mongoose model ....
                    model {$__: InternalCache, isNew: false, ...
                         */

                        return(returnedDocument)
                    }
                })




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
