import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Article} from "./article.model";
import {Observable} from "rxjs";
import { tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as UIActions from '../shared/store/ui.actions';
// import { ArticleAddComponent } from './article-add/article-add.component'; // << ?? used here ? re: categories fixer hmm.
import { Category } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
      private myHttp: HttpClient,
      private myStore: Store,
  ) { }

  createArticleB(myFormFieldsAndFiles: any): any { // << FormData, j'espere

      this.myStore.dispatch(new UIActions.StartLoading());
      /*
      Q. Hmm, we will StopLoading (via Store)
      over in the calling ArticleAddComponent
      (I think?)
      A. No, looks like you (wound up) doing so just below, here, in the Service.
       */

      /* PLAN B. NGRX for SPINNER */
      return this.myHttp.post(
          'http://0.0.0.0:8089/api/v1/articles/',
          myFormFieldsAndFiles
      ).pipe( // instead of: subscribe(
          tap(
          (articleConfirmationWeGot) => {
              console.log('PIPE. TAP. articleConfirmationWeGot ', articleConfirmationWeGot);
              /* PIPE. TAP. articleConfirmationWeGot
              articleTitle: "The Trump Administration Is Reversing 100 Environmental Rules. Here’s the Full List."
articleUrl: "https://www.nytimes.com/interactive/2020/climate/trump-environment-rollbacks.html?action=click&pgtype=Article&state=default&module=styln-climate&variant=show&region=TOP_BANNER&context=storylines_menu"
articleCategory: "politics"
__v: 0
_id: "5f1364e304e544a462218215"
               */

              /*
              TIMER ! (Fake it taking a little longer)
               */
              setTimeout(
                  ()=> {
                      this.myStore.dispatch(new UIActions.StopLoading());                  },
                  1000);

          }
          ), // tap()


              // return articleConfirmationWeGot; // ? << We got a mismatch seems?
          ); // /.pipe()

  } // createArticleB()


      createArticle(myFormFieldsAndFiles: any): Observable<Object> { // << FormData  << NO LONGER CALLING THIS

      /*
      OK.
      Q. *WHY* do we stop using "Plan A" here?
      A. Because, we want to Start and Stop a "Loading" spinner,
      here in the asynchronous (HTTP) call code.
      But the thing is, "Plan A" was *immediately* returning what the HTTP POST got,
      as an Observable, to the calling Component. That's Okay, but
      gave us No Place here in the Service code to put in a call to "Stop" the spinner!
      (I suppose you could Stop the spinner, back over in the calling
      Component; ah well.)

      So now with "Plan B" above, we've changed it up - the new method
       still does return the HTTP POST Observable directly as such,
       but, here on the Service, we ALSO .pipe() (not .subscribe() !!!)
       to get access to the data that was returned.
       In a benign .pipe(tap(()=>{})); we are able to console.log(), and
       to issue the NgRx/Store "StopLoading" dispatch too. cheers.
       */

          /* PLAN A. WORKS GREAT. */
              // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
              return this.myHttp.post(
                  'http://0.0.0.0:8089/api/v1/articles/', // << TODO environment Url Stub!
                  myFormFieldsAndFiles // << Just 2 fields for now
              );

    // HERE IS WHAT {PLAN A." RETURNS:
          // (As an Observable<Object>, apparently. Very nice.)
                  /* FEATURES THE "BE NAMING CONVENTION" for an Article. Bueno.
              {articlePhotos: Array(0),
              _id: "5f032c5daf6229101f019065",
              articleUrl: "Are Protests Unsafe? What Experts Say May Depend on Who’s Protesting What",
              articleTitle: "https://www.nytimes.com/2020/07/06/us/Epidemiologists-coronavirus-protests-quarantine.html", __v: 0}
               */

  } // /createArticle() << NO LONGER CALLING THIS.  See Plan "B."


    updateArticle(idPassedIn, editedArticle) {
      /*

      - Returns ... hmm, results of HTTP PUT call.
        Just sort of benign "ACK" msg. (or error, of course)
        But no data of substance
       */

        // DON'T FORGET!  PUT 'return' AT FRONT OF THIS LINE:
        return this.myHttp.put(`http://0.0.0.0:8089/api/v1/articles/${idPassedIn}`, editedArticle);

    }


    deleteArticle(idPassedIn) {
      return this.myHttp.delete(
          `http://0.0.0.0:8089/api/v1/articles/${idPassedIn}`
      );
    } // /deleteArticle()


    listArticlesOLD(): Observable<object> {
      return; //  kinda nothin'
    }
    /* "OLD"
    Placeholder while I work on copy/move
    of lots of logic from ArticleListComponent
    over here to ArticleService
     */

    // listArticles(): Observable<any> { // yeah, <any> works.
/* Hmm. That durned return type. wtf. */
    listArticles(): Observable<Object> { // Same story for <Object> and <object>. Hmm. o well.
    // listArticles(): Observable<object> { // No. Well, Yeah, IF/WHEN I put : [] to type the calling Component's .subscribe() { (allArticlesWeGot: [])
/*    Q. Where, how, why did I get this whole <object> <Object> thing anyways. Sheesh.
 */

    // GET ALL Articles
    // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
    return this.myHttp.get(
        'http://0.0.0.0:8089/api/v1/articles/',
    );
  }

    listArticlesPaginated(page, pagesize): Observable<object> { // Hmm. t.b.d. what this returns ?
      /*
      About that type, for the return.
      As seen over in (calling) ArticleListComponent:
      1. No. - : Observable<object> // << No. "Property 'maxArticlesFromServer' does not exist on type 'object'"
      2. No. - : Observable<Object> // << No. "Property 'maxArticlesFromServer' does not exist on type 'Object'"
      3.     - : any
       */
/*
    listArticlesPaginated(page, pagesize): Observable<Object> {
*/
        // GET "pagesize" # of Articles. TODONE: HARD-CODED so far: 1, 5

        // YES. DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
        return this.myHttp.get<{message: string, articlesPaginated: any, maxArticles: number}>(
            `http://0.0.0.0:8089/api/v1/articles?page=${page}&pagesize=${pagesize}`,
        )
            .pipe(
                map(
                    (dataWeGotFromServer) => {
                        console.log('Service. dataWeGotFromServer ', dataWeGotFromServer);
/* Yes.
{
   message: "(Paginated) Articles fetched successfully. Total count in Collection is 99.",
   paginatedArticles: Array(5),
   maxArticles: 99
}
So:
- Here in the Client Service, we get 3 properties returned to us from Server to Client (just above).
- But then we return only 2 of those properties back to the calling Client Component (just below).
cheers.
 */
                    return {
                        articlesPaginatedFromServer: dataWeGotFromServer.articlesPaginated,
                        maxArticlesFromServer: dataWeGotFromServer.maxArticles,
                    }
                    }
                )
            ); // /.pipe()
    } // /listArticlesPaginated()


    getArticle(idPassedIn) {
    return this.myHttp.get(
        `http://0.0.0.0:8089/api/v1/articles/${idPassedIn}`
    );
  } // /getArticle()

  getArticleMostRecent() {
    return this.myHttp.get(
        `http://0.0.0.0:8089/api/v1/articles/recent`
    );
  }

  /* **************************************************
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



    getCategoriesInService() {
        // console.log('WWW1 this.getCategoriesInService() this:,  ',  this );
        /* Yes.
        ArticleService {myHttp: HttpClient, myStore: Store, categoriesInService: Array(8)}

        Hmm, not clear to me why "this" works okay in this method,  -- getCategoriesInService
        but not in method below (requires .bind(), or => function). -- myMapBEArticlesToFEArticles
        Hmm. o well.
         */

        return this.categoriesInService;
    }

    /*     {}.bind(this) (encore une fois) to the rescue ( ! ) :o)
    * N.B. Needs --- myFuncName = function () {}.bind(this)
    * (Alternative of course was good old fat arrow instead...) -- chose not to use. cheers. */
    myMapBEArticlesToFEArticles = function (
        eachPseudoArticleFromApi: {
            _id: string,
            articleTitle: string,
            articleUrl: string,
            articleCategory: string,
        }
    ) {
        // this.articles = allArticlesWeGot.articlesPaginatedFromServer.map(
        //     () => {
        // console.log('WWW2 this.myMapBEArticlesToFEArticles() this:,  ',  this );
        /* No. (until I did .bind() fix)
        undefined

        Now YES
        ArticleService {myHttp: HttpClient, myStore: Store, categoriesInService: Array(8)}
         */

        let eachRealArticleToReturn: Article;

                /* CATEGORY FIXER
Go get 'viewValue' for the (stored) 'value'
returned from the DB.
e.g. 'u.s.' as value will return 'U.S.' as viewValue
*/
        let categoryViewValueSuchAsItIsReturned: string;

        categoryViewValueSuchAsItIsReturned = this.getCategoryViewValue(eachPseudoArticleFromApi.articleCategory);
        // categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(eachPseudoArticleFromApi.articleCategory);
                /* N.B. This used to be over in a Component that had to reach back to this Service to invoke.
                Now it is simply within the same Service. fwiw.

                Returns 'viewValue' e.g. 'No Category (thx Service!)' --OR-- category viewValue
                 */

                eachRealArticleToReturn = {
                    articleId_name: eachPseudoArticleFromApi._id,
                    articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                    articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                    articleCategory_name: categoryViewValueSuchAsItIsReturned,
                }

                return eachRealArticleToReturn;
            // }
        // ) // /allArticlesWeGot.map()

    }.bind(this) // /myMapBEArticlesToFEArticles()

    categoryThatMatches: Category; // Q. declare here ok?  A. works, but, << really should be up at top of class

    getCategoryViewValue(storedCategoryValue: string): string {
        // console.log('PASSED IN storedCategoryValue ', storedCategoryValue); // e.g. living (lowercase, BE value)
        /* WAS IN ArticleListComponent (and ArticleAdd)

         */

        let categoryViewValueNoCategory: boolean;
        let categoryViewValueNoMatchUnexpectedValue: boolean;
        // let categoryThatMatches: Category; // see above...
        const NO_CATEGORY = 'No Category (thx Service!)';
        let categorySuchAsItIsToReturn: string;

        let categoryThatMatchesArrayElementIndex: number;
        /*
        We do .findIndex() instead of .find()
        Returns the Array Element Index.
        If
         */

        this.categoryThatMatches = {
            value: 'no value',
            viewValue: 'no viewValue'
        };

        // this.categoryThatMatches
        categoryThatMatchesArrayElementIndex = this.categoriesInService.findIndex(
            (eachCategoryPair: Category) => {
                if (typeof storedCategoryValue === "undefined") {
                    categoryViewValueNoCategory = true;
                } else {
                    // we DO have *SOMETHING* (a Category?) on this "BE Article"....

                    // now let's see if it matches the current entry from the array of possible Categories:
                    if (storedCategoryValue === eachCategoryPair.value) {
                        return true;
                        /* Signalling/returning "true" to
                        Array.find() means it will
                        return the current array element,
                        which is what we want.
                        cheers.
                         */
                    } else {
                        // Not "the answer" (yet)
                       // console.log('getCategoryViewValue. ERROR! Value from BE for "Category" is: 1) NOT undefined, and 2) NOT a match on anything in our list of Categories. What the Sam Hay is it? W-a-a-l, it is: storedCategoryValue: ', storedCategoryValue );
                        /* e.g. TODONE we ain't done yet. gotta go shave. done the shave, too.
                         No Category (thx Service!)
                         */
                    } // /} else {
                } // /else {
            }
        ); // /.find()

        /* BUG Fixing.
It IS possible that dirty data get in. (Solly!)
Need to defend against.
If *NO* entry from "categoriesInService" matched (just above),
And if the data value here-in was *NOT* "undefined" (further above),
Then here in this "else {}" we need to
report the issue, throw Error, whatever.
cheers.
 */
        /* How BUG Occurred/Discovered
        "I was able to create (by editing) (uh-oh) one Article in the database that got a
NON-PERMISSIBLE value for articleCategory: "No Category (thx Service!)"
That is supposed to be just a FE Display string, but
it got saved back to the database. sigh."
         */

        console.log('categoryThatMatchesArrayElementIndex ', categoryThatMatchesArrayElementIndex);

        if (categoryViewValueNoCategory) {
            categorySuchAsItIsToReturn = NO_CATEGORY;
        } else if (categoryThatMatchesArrayElementIndex === -1) {
            // Not Found is -1, yes ? << Yes, that's right.
            categorySuchAsItIsToReturn = 'NO_CORRECT_CATEGORY';
        } else {
            categorySuchAsItIsToReturn = this.categoryThatMatches.viewValue;
        }

        return categorySuchAsItIsToReturn;

    } // /getCategoryViewValue()

    categoriesInService: Category[] = [ // New York Times categories
        // NO LONGER >> N.B. 'News' is default TODONOPE how is its *value* handled? hmm
        {
            value: 'news',
            viewValue: 'News',  // 'News-SERVICE',
        },
        {
            value: 'world',
            viewValue: 'World',
        },
        {
            value: 'u.s.',
            viewValue: 'U.S.',
        },
        {
            value: 'politics', // TODO rename to 'politics'
            viewValue: 'Politics',
        },
        {
            value: 'opinion',
            viewValue: 'Opinion',
        },
        {
            value: 'business',
            viewValue: 'Business',
        },
        {
            value: 'arts',
            viewValue: 'Arts',
        },
        {
            value: 'living',
            viewValue: 'Living',
        },
    ];


    // ***  UTILITIES  **************************************

    // ***  DATE UTILITIES  **************************************
    // Now in our DateService (under /core/)
    // https://steveridout.github.io/mongo-object-time/
/*
    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };
*/




} // /class ArticleService
