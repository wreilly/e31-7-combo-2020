const trimUrlMiddlewareModule = {};

/*
 Middleware, to simply trim the usually long NYTimes URL.
 * Used in: API Router api-articles.js
*/


// SEE NOTES IN
// /Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/server/middleware/trim-url-is-all.js

trimUrlMiddlewareModule.myMiddlewareTrimUrlFunction = function(req, res, next) {

    console.log('1. PRE-REGEX req.body.articleUrl_name: ', req.body.articleUrl_name);
/*
1. PRE-REGEX req.body.articleUrl_name:  https://www.nytimes.com/2020/07/24/us/portland-oregon-protests-white-race.html?action=click&pgtype=Article&state=default&module=styln-george-floyd&region=TOP_BANNER&context=storylines_menu
trim-url-is-all.js:18

*/

    req.body.articleUrl_name = req.body.articleUrl_name.replace(/(.*?\?(?:(?!\?))).*/, '$1');

    console.log('2. POST-REGEX req.body.articleUrl_name: ', req.body.articleUrl_name);
/*
2. POST-REGEX req.body.articleUrl_name:  https://www.nytimes.com/2020/07/24/us/portland-oregon-protests-white-race.html?
trim-url-is-all.js:26

 */
// << Note the final ? is still on the string. :o(

    if(req.body.articleUrl_name.substr(
        req.body.articleUrl_name.length - 1 ) === '?'
    ) {
       req.body.articleUrl_name = req.body.articleUrl_name.slice(0, -1);
        console.log('3. POST-SLICE req.body.articleUrl_name now is: ', req.body.articleUrl_name);
/*
3. POST-SLICE req.body.articleUrl_name now is:  https://www.nytimes.com/2020/07/24/us/portland-oregon-protests-white-race.html?   << Hmm, didn't work!

FIXED IT
3. POST-SLICE req.body.articleUrl_name now is:  https://www.nytimes.com/2020/07/27/us/coronavirus-data.html  << happy
 */
    } else {
        console.log('(3.B.) URL did not end in "?" - we didn\'t alter it.');
    }

    next(); // keep going, in that Express way!

} // /function myMiddlewareTrimUrlFunction()

module.exports = trimUrlMiddlewareModule;
