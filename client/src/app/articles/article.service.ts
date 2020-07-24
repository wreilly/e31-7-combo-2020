import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Article} from "./article.model";
import {Observable} from "rxjs";
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as UIActions from '../shared/store/ui.actions';

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
      Hmm, we will StopLoading (via Store)
      over in the calling ArticleAddComponent
      (I think?)
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


      createArticle(myFormFieldsAndFiles: any): Observable<Object> { // << FormData

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

  } // /createArticle()

  listArticles(): Observable<Object> {
    // GET ALL Articles
    // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
    return this.myHttp.get(
        'http://0.0.0.0:8089/api/v1/articles/',
    );
  }

  getArticle(idPassedIn) {
    return this.myHttp.get(
        `http://0.0.0.0:8089/api/v1/articles/${idPassedIn}`
    );
  }

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

}
