import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';

/*
https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
 */
import { Router } from '@angular/router'; // ActivatedRoute
/* re: <router-outlet on-activate=""> see:
https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
 */

// *** NGRX STUFF ***
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/app.reducer';

import { Article } from './article.model';
import { ArticleService } from './article.service';
import {Observable} from "rxjs";
import {ArticleDetailComponent} from "./article-detail/article-detail.component";
import {ArticleDetailTwoComponent} from "./article-detail-two/article-detail-two.component";


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  articleMostRecentDisplayBE: {
    _id: string,
    articleTitle: string,
    articleUrl: string,
  };
  articleMostRecentDisplayFE: Article;

  /* ========================================
   *  NGRX Experiment  *
   * In lieu of ( ? ) <router-outlet on-activate="">
   We'll try Store .dispatch() and .select(),
   * 1) ArticleDetailComponent
   * We'll do .dispatch() I think in same place
   * where we did the .emit(), near bottom
   * of .getArticle()
   *
   * 2) ArticlesComponent
   * .select()
   * now needs to get assigned to Observable$,
   *  >> e.g.  articleToEditIdObservable$  <<
   * probably in OnInit() or similar... t.b.d.
   * NOT where we did the .subscribe(), which
   * was down in the myOnActivate(). I think.
   *
   * WUL
 (I think I can leave in most of the existing code, e.g. @Output etc.
 * but I probably need to turn off the on-activate() biz ?) hmm. just so we don't get
 * competing (or redundant therefore untestable)
 *  boolean values & etc.
 *
 * We'll see.
 * =========================================
 * */

  // articleToEditId: string;
  articleToEditIdObservable$: Observable<string>; // << NGRX Jazz

  weAreEditingObservable$: Observable<boolean>; // More Jazz
  // weAreEditing = false;
  // weAreEditing = true;

  constructor(
      private myArticleService: ArticleService,
      // myActivatedRoute: ActivatedRoute,
      private myRouter: Router,
      private myStore: Store,
  ) {
    console.log('CONSTRUCTOR. BASTA.');
    this.myRouter.routeReuseStrategy.shouldReuseRoute = () => false;
    /* f'ing "@Pascal'
    https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
    MUCH better Comment:  Thanks, "@AC"
    https://nativescript.org/blog/how-to-extend-custom-router-reuse-strategy/
    "add the [above] to the constructor of a ***specific component***" << "ah-hah" moment. sheesh.
     */

/* NO. This "Activated" biz is for params, queryparams. Not for "NavigationExtras.data"

    myActivatedRoute.data
        .subscribe(
            (dataWeGot) => {
              console.log('CONSTRUCTOR. ACTIVATED ROUTE. dataWeGot ', dataWeGot); // undefined   '.data' is not "it"
    )
*/
  } // /constructor()

  ngOnInit(): void {
    // this.articleMostRecentDisplayFE = null; // initialize hmm?

    console.log('TRUE ONINIT. history.state.data ?????? ', history.state.data);

    // this.getArticleMostRecent(); // fine for FIRST time ...
    /* Very exciting. We shall see. Hmmph.
(SEE ALSO HEADER.COMPONENT.HTML & SIDENAV.COMPONENT.HTML)
https://medium.com/ableneo/how-to-pass-data-between-routed-components-in-angular-2306308d8255

https://angular.io/api/router/NavigationExtras#state
*/

// NOT USING - Get routed data from Clicked button in Previous route
//    console.log(this.router.getCurrentNavigation().extras.state);

// Get route data from Browser History
    // N.B. Will be LOST if user refreshes page. (Or hits back button ( ? ))
    console.log('ONINIT. history.state.data ', history.state.data);
    if (history.state.data) {
      // WIDER SET OF LINKS = HEADER, SIDENAV
      /* UPDATE.
      Now is it **ALL** sets of these links:
      HEADER, SIDENAV, and yes also the (local) ARTICLES.COMPONENT
       */
      if (history.state.data.articleMostRecentHideRouterLinkState) {
        console.log('TRUE. HIDE. ONINIT. history.state.data ', history.state.data);
        console.log('TRUE. HIDE. ONINIT. 01 this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
        this.hideArticleMostRecent();
        console.log('TRUE. HIDE. ONINIT. 02 this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
      } else if (!history.state.data.articleMostRecentHideRouterLinkState) {
        this.getArticleMostRecent();
      } else {
        console.log('Dang. No history re: hide/show MostRecentArticle. Dang.');
      }
    } else if (!history.state.data) {
      // Hmm, below was RIGHT, before. But NOT now. Sigh.
      // ==============
      // LOCAL SET OF LINKS = ARTICLES.COMPONENT ITSELF
      // Do nothing here in ngOnInit.
      // For this little grouping of
      // "Parent" Component Articles and
      // "Children" Components
      // ArticleList and ArticleAdd
      // their linking and hide/show logic takes care of itself.
      // No need for ngOnInit() logic.
    }

    /*  =====   NGRX STUFF   =========
Huh. This is NOT WORKING. "undefined" in Store. :o(
At least not here in ngOnInit().
NEITHER in  ngAfterViewInit() !
NOR in ngOnChanges() !
"oh-for-three" :o(

Next up: Back to <router-outlet on-activate>

Bit later. (Okay, *quite* a bit later):
Hah.
Issue was not, where in this ArticlesComponent do I invoke it.
No. Turns out, invoking it right here in ngOnInit() is FINE.
Issue was, in my Reducer (and Actions), the myPayload: { string }
did not be happy, whereas myPayload: string was FINE. (odd. frustrating)
o well!
     */

    // WORKING LIKE A CHAMP
    // Hmm, gets it too soon ! o la
    // WRONG: << do not run here in OnInit.
    // Instead WE DO STILL RUN IT below IN ROUTER-OUTLET ON-ACTIVATE
    // Y?
    // Because we DON'T want that Article ID UNTIL we do get
    // the ArticleDetailComponent. NOT the other kinds of Components
    // that can appear via this router-outlet. cheers.
/*
    this.articleToEditIdObservable$ = this.myStore.select(fromRoot.getArticleIdIs); // o well
*/


  } // /ngOnInit()


  ngAfterViewInit() {
    console.log('AFTER VIEW INIT');
    /*  =====   NGRX STUFF   =========
    NEW NEWS: This does work here, but, seems better to put/leave in ngOnInit(). cheers.
OLD NEWS: Huh. This is NOT WORKING. "undefined" in Store. :o(
 */
  //  this.articleToEditIdObservable$ = this.myStore.select(fromRoot.getArticleIdIs); // << yeah worked

/*
    console.log('AFTER VIEW Kids 01 & this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
    if (!this.articleMostRecentDisplayFE) {
      console.log('AFTER VIEW Kids 02');
      this.getArticleMostRecent(); // ?? NO. does not run "navigating" back to /articles ?
    }
*/

  }



  ngOnChanges() {
      console.log('NG ON CHANGES()'); // << Hmm. not seen. hmm
          /*  =====   NGRX STUFF   =========
          ngOnChanges seems to NOT be the place to mess with this.
          cheers.

Huh. This is NOT WORKING. "undefined" in Store. :o(
 */
/*  this.articleToEditIdObservable$ = this.myStore.select(fromRoot.getArticleIdIs);*/

/*
    Better explanation:
    "Angular calls the ngOnChanges() method of a component or directive whenever it detects changes to the input properties."
    https://angular.io/guide/lifecycle-hooks#onchanges

    Hmm:
        N.B.  "ngOnChanges() is called when any data-bound property of a directive changes"
           https://angular.io/api/core/OnChanges
     *!/
    console.log('ON CHANGES Kids 01 & this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
    if (!this.articleMostRecentDisplayFE) {
      console.log('ON CHANGES Kids 02');
      this.getArticleMostRecent(); // ?? NO. nothin' !! ??
    }
    */

  } // /ngOnChanges()


  // NOT USED, NOT CALLED
  setWeAreEditingToTrue() {
    /* No. Why?
    This is NOT working. How tum?

    UPDATE.
    Kids, this isn't working, because, THIS "PARENT" COMPONENT
    that HOSTS THE ROUTER-OUTLET
    ** ALSO ** re-runs its whole ngOnInit()  !! (didn't exactly expect that)
    when a new URL/ROUTER-THING-A goes through that
    damned <router-outlet>
    So: weAreEditing is set back to FALSE.
    cheers.

    Hmm, we have on-click on same link as drives to another URL, router-outlet etc.
    Something amiss in trying to change value (false to true) on this
    component that hosts that router-outlet, while driving the child
    component to (I think?) re-render itself, hey? Hmm.
    We'll try another approach: again pass @Output from child ArticleDetailComponent
    UP to parent (this Component): ArticlesComponent, to .subscribe() to in the OnActivate(),
    regarding message of "Hey, I'm now being edited, ya darn fool!"
     */

    // NOT USED
/*
    this.weAreEditing = true;
    console.log('this.weAreEditing: ', this.weAreEditing); // yeah, we see it say 'true'
*/
    // but this ain't working on the template. something to do with re-rendering (?) of stuff
    // through new URL "/edit" and router-outlet and all that jazz.

  } // /setWeAreEditingToTrue() // << NOT CALLED




      myOnActivate(componentReferenceFromRouterOutlet) {

/* WEBSTORM - "INFER TYPE FROM USAGE"
Automatically discovered this:

  myOnActivate(componentReferenceFromRouterOutlet: { tellingYouMyId: any; weAreEditingNow: { subscribe: (arg0: (dataWeGet: any) => void) => void; }; }) {
*/
/* COMMENTS on above
That (I guess?) matches one (ok) but not all (!?) of the
possible Components that can be loaded via this
router-outlet. Hmm.
- Matches (I guess?): ArticleDetailComponent.
- Does not match: ArticleAddComponent, ArticleListComponent, ArticlesComponent. Hmm.

Doesn't break or complain though. hmm.

TEST: 01 << Nope
I just put this artificially, benignly, on ArticleListComponent:
    @Output()
    testOutputDoesNotDoAnythingOnList: string;
Result, as t'were:
Well, nothing happened. WebStorm did not suggest a new/different
type for the myOnActivate() parameter.
Since it had put in the two "@Output()" I had on ArticleDetailComponent,
I thought introducing another @Output() onto
another Component that comes through this router-outlet, WebStorm
might suggest the type now included that, too. Did not. Hmm, etc.

TEST 02 << Nope
Okay, tried similar to above, but this time also on ArticleDetailComponent.
    // 3. TEST
    @Output()
    testOutputDoesNotDoAnythingOnDetail: string;
Result: No change, not affected by it.

FINDING
- Okay, only now do I (finally) see: what WebStorm is reading is not
the possible Components that come through this router-outlet (too crazy).
It is just reading what is right below here, inside this method.
easy-peasy. all that is down there (have a look) is the stuff mentioned
in the type: "tellingYouMyId" and "weAreEditingNo" etc.
OK.
 */



    // https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
    console.log('componentReferenceFromRouterOutlet ', componentReferenceFromRouterOutlet);
    /* N.B.
Now handling TWO different events/pieces-of-info:
1. Here is the _id for the article in ArticleDetailComponent. (Use that _id to set the /:_id/edit link)
2. User has now clicked on that /edit URL, so shift to weAreEditing to TRUE. (Use that to disable the Edit link)
*/

        // 1.A. << NGRX now, no more EventEmitter.
        // Therefore, more better "if" test is based on
        // WHICH COMPONENT TYPE, << good
        // not some particular "flag" property on it. << bit hack-y
        if(componentReferenceFromRouterOutlet instanceof ArticleDetailTwoComponent) {
/* OLD Now Superseded...
        if(componentReferenceFromRouterOutlet instanceof ArticleDetailComponent) {
*/
          /* THX, StackOverflow!
          if(componentRef instanceof ChildWithWorksMethodComponent){ ...
          https://stackoverflow.com/questions/45720655/access-router-outlet-component-from-parent
           */

/* THIS WORKED, BUT IS/WAS CLUNKY. Especially now with NGRX I no
longer even use this ".tellingYouMyId" EventEmitter.
    // 1.
    if(componentReferenceFromRouterOutlet.tellingYouMyId) {
*/
      // Only ArticleDetailComponent has that property ^^
      // The other possible Components passed to this <router-outlet> won't have it



      /* ===   NGRX STUFF   ==========

WRONG >> Glory be! Yes! The Store allows me to NOT have to deal with this
on-activate() passing of data from child up to parent
through a router-outlet.
I mean, it worked fine, but, with Store, I get to SKIP IT. << WRONG
See instead simply ngOnInit(). << WRONG
cheers.

UPDATE. We *do* have to still do this down here in myOnActivate().
        *Not* up in ngOnInit().
        Q. Y?
        A. We still need to trigger all this logic upon the router-outlet
        sending in/loading whatever (child) Component, and only *then*,
         "(up)on-activate(ing)" that (child) Component,
         *then* we proceed with this kind of logic.
         Not just "on-init" of this (parent) ArticlesComponent. No.
       */
     this.articleToEditIdObservable$ = this.myStore.select(fromRoot.getArticleIdIs);
     // WRONG: >> not using here, not needed to be run from here.
      // YES WE DO STILL RUN IT FROM HERE IN ROUTER-OUTLET ON-ACTIVATE
      // Y?
      // Because we DON'T want that Article ID UNTIL we do get
      // the ArticleDetailComponent. NOT the other kinds of Components
      // that can appear via this router-outlet. cheers.

  /* SUPERSEDED BY NGRX  ???
  What ?? hmm, we still do need this apparently ? why? TODONE figure out 2020-07-21-0852 cheers
  * */
      // tellingYouMyId is an EventEmitter. You can subscribe to its events (stream)
/* YEAH, THIS IS (NOW) SUPERSEDED BY NGRX. WAS WORKING FINE. JUST SO YOU KNOW.
      componentReferenceFromRouterOutlet.tellingYouMyId.subscribe(
          (dataWeGet) => {
            this.articleToEditId = dataWeGet; // MongoDB _id
          }
      )
*/

    }


        // 2.A. (SAME COMMENT as above at "1.A.") << NGRX now, no more EventEmitter.
        // Therefore, more better "if" test is based on
        // WHICH COMPONENT TYPE, << good
        // not some particular "flag" property on it. << bit hack-y
        if(componentReferenceFromRouterOutlet instanceof ArticleDetailTwoComponent) {
        /*  OLD Now Superseded...
              if(componentReferenceFromRouterOutlet instanceof ArticleDetailComponent) {
        */

          /* THX, StackOverflow!
          if(componentRef instanceof ChildWithWorksMethodComponent){ ...
          https://stackoverflow.com/questions/45720655/access-router-outlet-component-from-parent
           */
          /*
    // 2.
    if(componentReferenceFromRouterOutlet.weAreEditingNow) {
*/
      // Only ArticleDetailComponent has that property ^^ << bit hack-y
      // The other possible Components passed to this <router-outlet> won't have it

          /*  ===   NGRX STUFF

           */
          this.weAreEditingObservable$ = this.myStore.select(fromRoot.getAreWeEditing);

/* NO LONGER USING. Now NGRX
      // weAreEditingNow is an EventEmitter. You can subscribe to its events (stream)
      componentReferenceFromRouterOutlet.weAreEditingNow.subscribe(
          (dataWeGet) => {
            this.weAreEditing = dataWeGet; // boolean
          }
      )
*/
    } // if()

  } // /myOnActivate (from RouterOutlet)


  hideArticleMostRecent() {
    // HACK-Y!
    this.articleMostRecentDisplayFE = null;
  }


  getArticleMostRecent() {
    this.myArticleService.getArticleMostRecent()
        .subscribe(
            (whatIGot:{
              _id: string,
              articleTitle: string,
              articleUrl: string,
            }) => {
              console.log('ARTICLES. Most Recent. whatIGot BE ', whatIGot);

              this.articleMostRecentDisplayBE = whatIGot; // << whamma-jamma for BE flavor
              console.log('fwiw, this.articleMostRecentDisplayBE ', this.articleMostRecentDisplayBE);
              /*
              ARRAY of one - same as above.
               */

              /* =====================================
                 TIME TO "CONVERT" TO THE "FE NAMING CONVENTION" for an Article
                 =====================================
              */
              // 04  ** YES **  Object Literal Initializer << whoa
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
              // N.B. 1st item off ARRAY[0] <<

              /* CATEGORY FIXER */
              /*
              Go get 'viewValue' for the (stored) 'value'
    returned from the DB.
    e.g. 'u.s.' as value will return 'U.S.' as viewValue
               */
              let categorySuchAsItIsReturned: string;
              categorySuchAsItIsReturned = this.myArticleService.getCategoryViewValue(whatIGot[0].articleCategory)

              this.articleMostRecentDisplayFE = {
                articleId_name: whatIGot[0]._id,
                articleTitle_name: whatIGot[0].articleTitle,
                articleUrl_name: whatIGot[0].articleUrl,
                articleCategory_name: categorySuchAsItIsReturned,
                // articleCategory_name: whatIGot[0].articleCategory,
              };
              console.log('*MUCH* MORE BETTER fwiw, this.articleMostRecentDisplayFE $$$ :o) ', this.articleMostRecentDisplayFE);
              /* "FE NAMING CONVENTION" = bueno
              This is officially of 'Type' 'Article' - good.
Hmm:
{articleId_name: undefined
articleTitle_name: undefined
articleUrl_name: undefined}
               */

            }
        );
  } // getArticleMostRecent()

  ngOnDestroy() {

/* NO LONGER USING NOW NGRX
    this.weAreEditing = false; // << Needed on "destroy"? Since class property sets it to default of false ?
*/

// Hmm, instead of here in ngOnDestroy() of (parent) ArticlesComponent,
// will try first in (child) ArticleDetailComponent
    // this.myStore.dispatch() ... // << Nah ( ? )
  }

}
