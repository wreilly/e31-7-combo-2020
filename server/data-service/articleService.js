const mongoose = require('mongoose');
const articleModelHereInService = require('../models/articleModel');

/* $$$$$$  TO BEGIN  $$$$$$$

- API-only (not for Node/Express app)
- .get('/')

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

} // /articleService

module.exports = articleService;
