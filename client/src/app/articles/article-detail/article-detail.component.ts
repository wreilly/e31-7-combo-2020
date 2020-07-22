import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
import {BehaviorSubject, Observable} from 'rxjs'; // << ?? t.b.d.
import { map, tap } from 'rxjs/operators';
/* ??
import {url} from "inspector";
*/
// ** NGRX STUFF **
import { Store } from '@ngrx/store';

import * as UIActions from '../../shared/store/ui.actions'; // Here, we .dispatch(), yes.
import * as fromRoot from '../../store/app.reducer'; // But we do not need/do .select(). No.
// Well, not till now: .select() to find out if we are editing!  This Component "needs to know"
// Before, we were just sending out that info (are we editing or not) to other (parent) Component to know.
// cheers

@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {

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



    /*
    CHILD-to-PARENT "Communication" ** by way of <router-outlet> **
    https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
     */
    /* N.B.
Now handling TWO different events/pieces-of-info:
1. Here is the _id for the article in ArticleDetailComponent. (Use that _id to set the /:_id/edit link)
2. User has now clicked on that /edit URL, so shift to weAreEditing to TRUE. (Use that to disable the Edit link)
*/
/* NO LONGER. NOW NGRX.
    // 1.
    @Output()
    tellingYouMyId: EventEmitter<string> = new EventEmitter<string>();
*/

/* NO LONGER. NOW NGRX.
    // 2.
    @Output()
    weAreEditingNow: EventEmitter<boolean> = new EventEmitter<boolean>();
*/

/*    // 3. TEST (see myOnActivate in ArticlesComponent)
    @Output()
    testOutputDoesNotDoAnythingOnDetail: string;
    */

    urlHereToSeeWhetherEditingObservable$: Observable<string>; // ugh worked with | async, but *not* making it go in TS logic. urgh
    urlHereToSeeWhetherEditingBehaviorSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('FAKEURL-INITIALVALUE-BEHAVIORSUBJECT');
    urlHereAsObservableFromBehaviorSubject$ = this.urlHereToSeeWhetherEditingBehaviorSubject$.asObservable();
    urlHere: string;

    areWeEditingObservable$: Observable<boolean>;
    areWeEditing = false;

    // DOT.NEXT() (not "DOT.PIPE()"/ASYNC) << ?
    /* No Longer Using
      Below (I guess?) was an odd "array" experiment I didn't really need to run...
        articleAsOneItemArrayHereInDetailPage: any[] = [];
     */

    /* NO. Did not work, etc.
        articleAsObservableHereInDetailPage$: Observable<any[]>;
        // articleAsObservableHereInDetailPage$: Observable<Object>;
*/
        articleHereInDetailPage;

/* Dev testing etc.
        articleHereInDetailPageAttempt01: Article = {
            articleId_name: null,
            articleTitle_name: 'title placeholder',
            articleUrl_name: 'url placeholder',
        };
*/

        constructor(
            private myArticleService: ArticleService,
            private myActivatedRoute: ActivatedRoute,
            private myStore: Store,
        ) {
            console.log('999 do you see me?');
            /*
            https://angular.io/api/router/ActivatedRoute
            Note: This code is in constructor per above.
            I'd also had a activateRoute.params .subscribe
            below, in the getArticle() (called from ngOnInit().)
            I guess this all works. cheers. << HAH.

            UPDATE on THAT silly assumption.
            NO. Did'nt "all work." Uh-unh.
            Here in constructor, okay to do this set up of
            myActivatedRoute.url to assign to the Observable
            "urlHere...Editing$". That's fine.
            And, if all you need is that string value
            e.g. 5b01e393b810e02daf607239/edit
            out on the HTML template, then use | async and you're
            good to go.
            But, if you need that string value here in TypeScript
            to programmatically do something (like see if '/edit' is
            on the end of it), then here in TypeScript you need to
            either .subscribe() or .pipe() it to get at that
            string value.
            I do the latter down below, in getArticle()
             */
        // const url: Observable<string> = myActivatedRoute.url.pipe(map(segments => segments.join(''))); // angular.io one-liner. very nice.

        this.urlHereToSeeWhetherEditingObservable$ = myActivatedRoute.url.pipe(map((segments) => {
            console.log('9999 do you see me?');
            // ^^ MAI VISTO. TROPPO PRESTO.
            // (Until I later do .pipe() on it below to access the Observable's string. okay. << ?
/* We do this below instead of here.
            this.urlHere = segments.join('/'); // << fuhggeddaboudid
*/
            console.log('Constructor. PIPE off ActivatedRoute.url. this.urlHere ', this.urlHere); // undefined << ?? Now FAKEURL-INITIALVALUE-BEHAVIORSUBJECT

            return segments.join('/'); // << yeah needed.
        }));
        console.log('this.urlHereToSeeWhetherEditingObservable$ ', this.urlHereToSeeWhetherEditingObservable$); //  << Yep "Anonymous Subject {}"
        console.log('this.urlHere ', this.urlHere); // << undefined << Troppo presto, signore.
        /*
        e.g. /:id/edit   OR /5af746cea7008520ae732e2c/edit
         */
/* Do this later, below, somewheres.
        if (this.urlHere.search(/\/edit$/mg)) {
            // https://regexr.com/  https://regex101.com/  :)
            this.areWeEditing = true;
        }
*/
        // this.areWeEditing = true; // hard-code it, kids!

    } // /constructor() {}


    ngOnInit() {

        this.areWeEditingObservable$ = this.myStore.select(fromRoot.getAreWeEditing);
            
        this.getArticle();

/* NO. (dummy)
        // Take two: << D'oh. No. Too soon. Gotta wait for async call above!!
        this.tellingYouMyId.emit(this.articleHereInDetailPage.articleId_name);
        // SENDING TO PARENT ARTICLES.COMPONENT
*/
    }

    getArticle() {
        console.log('getArticle 1111-AAAA!');

        /*
Maybe this is also the time to see what the d-@#$%^&-d URL is, whether we are /edit-ing!
 */
        // **************    NOTHING DOING  &&&&&&&&&&&&&&&&&&&&
        // DOING *** NOTHING ***  << .PIPE() SUCKS
/*
        this.urlHereToSeeWhetherEditingObservable$.pipe(tap(
            (urlFromActivatedRoute) => {
                console.log('GetArticle.  .Pipe.tap off urlHere$. we get: urlFromActivatedRoute ', urlFromActivatedRoute);
                this.urlHereToSeeWhetherEditingBehaviorSubject$.next(urlFromActivatedRoute);

                // this.urlHere = urlFromActivatedRoute;
                console.log('blah PIPE. this.urlHere ', this.urlHere);
                // REGEX TIME
                if (this.urlHere.search(/\/edit$/mg)) {
                    // https://regexr.com/  https://regex101.com/  :)
                    console.log('RegEx PIPE passed we are editing seems');
                    //this.areWeEditing = true;
                }
                return urlFromActivatedRoute;
            }
        )) // /.pipe() urlHere...Editing$
*/
        // /DOING *** NOTHING *** (above)
        // **************    /NOTHING DOING  &&&&&&&&&&&&&&&&&&&&



        console.log('getArticle 1111-AAAA-ZZZZ-URGH!');

        // OH YEAH BABY-KINS! *** OH YEAH ***  << .SUBSCRIBE() WHERE IT'S AT
        this.urlHereToSeeWhetherEditingObservable$.subscribe(
            /*
            (above) got initialized in the constructor(), off the ActivatedRoute 'url'
            Here in .getArticle() immediately called in ngOnInit(),
            we (apparently) can immediately .subscribe() to it, get that URL.
            Goal is to test: "Does it contain /edit at the end ?"
            From that we set "areWeEditing" to T or F. bueno.
            cheers
             */

            (urlFromActivatedRoute) => {
                console.log('GetArticle. .Subscribe. off urlHere$. we get: urlFromActivatedRoute ', urlFromActivatedRoute); // << YES. Finally fucking works. 5af746cea7008520ae732e2c
                this.urlHereToSeeWhetherEditingBehaviorSubject$.next(urlFromActivatedRoute);
                this.urlHere = urlFromActivatedRoute; // whamma-jamma. ok.
                console.log('blah. SUBSCRIBE this.urlHere ', this.urlHere); // YES. 5af746cea7008520ae732e2c/edit
                // REGEX TIME
                if (this.urlHere.match(/\/edit$/g)) {
                    // https://regexr.com/  https://regex101.com/  :)
                    console.log('RegEx SUBSCRIBE WORKS WORKS WORKS passed we are editing seems');

                    /*  ===   NGRX STUFF
Hmm, is this point, where we *just got* the logic of '/edit' off the URL,
     is this point "too early" ( ? ) to do this Store Action Dispatch ? (Hmm, why would it be?)
Should I instead do it further along, where the EventEmitter did its .emit() ? (Hmm)
(That "further along" point is near the end of .getArticle(). Same place we .dispatch() the article ID to the Store. cheers)

This seems to be working FINE for the FIRST time through, but navigating to bring up a 2nd
ArticleDetail to "edit" seems to be not quite right. May be owing to "this point" vs. another,
May just be something else. W-I-P.

btw, related question: just *where/when* do we .dispatch the FALSE action that we are No Longer Editing, hey?
For now: in the (parent) ArticleComponent's ngOnDestroy() ? hmm
Soon-(ish): Or of course (in (near) future), could be off the (not yet created) <form> submit from the ArticleDetailComponent in "editMode". Guess that would be a .dispatch to the Store, which would of course get read/known/updated
in the (parent) ArticlesComponent, which would then "do the right thing" to hide the "(Editing)" nav tab bar thing. cheers.
                     */
                    this.myStore.dispatch(
                        new UIActions.TellingYouIfWeAreEditing(
                            { areWeEditingInAction: true} // AH-HAH moment. Got to match the danged constructor signature, kids!
                        )
                    );


                    // =================================================
/* NO LONGER (GOING TO BE) USED. NGRX instead
                    this.areWeEditing = true; // << YES this logic works, etc. bueno.
*/
                    // Above is used LOCALLY here on the ArticleDetailComponent HTML as flag

                    // Take FOUR: << NO. >>  ("the charm") :)? << NO. Hitting dumb error "Expression Changed" = TOO SOON.
                    // Below is used to SEND TO PARENT that we are editing,
                    // to disable that "Edit Article" link up on ArticlesComponent
/* NOT HERE
                    this.weAreEditingNow.emit(true);
*/
                    // SENDING TO PARENT ARTICLES.COMPONENT
                    // =================================================
                    /* As with other case of this, hit error, but the value does come through: 'true' o well
                    Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
    at throwErrorIfNoChangesMode
                     */

                }

                // ?? Do we need to return anything?  Didn't break stuff having it return. Hmm.
                return urlFromActivatedRoute;
            }
        ); // /.subscribe() urlHere...Editing$

        console.log('getArticle 1111-BBBB!');

        /*
        Nutty stuff. Looking to for inspiration (I guess)
/Users/william.reilly/dev/Angular/projects/email-fabricator/src/app/hbsp/heat-http/heat-http-dotnext/heat-http-dotnext.component.ts
WUL
         */

        this.urlHereAsObservableFromBehaviorSubject$.subscribe(
            (urlWeFinallyGotIHope) => {
                console.log('urlWeFinallyGotIHope ', urlWeFinallyGotIHope);
                // << YES. Finally fucking works. 5af746cea7008520ae732e2c
                this.urlHere = urlWeFinallyGotIHope;
                // JESUS.
            }
        )



        console.log('getArticle 1111-CCCC!');

        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                /* Here we SUBSCRIBE, not just snapshot oninit. cool.
                Cf. I used snapshot simply on 2018 ArticleAddComponent areWeEditing()
                /Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/client/src/app/article-add/article-add.component.ts

                https://stackoverflow.com/questions/46050849/what-is-the-difference-between-activatedroute-and-activatedroutesnapshot-in-angu
                 */
                console.log('getArticle 222!');
                const articleIdHereInDetailPage = paramsIGot['article_id'];
                /* ^^
                That 'article_id' param name is
                 determined in the (Article) Routing Module
                 */

/* Take one: TOO SOON (throws below error, but did get the ID value, fwiw.)
                this.tellingYouMyId.emit(articleIdHereInDetailPage);
                // SENDING TO PARENT ARTICLES.COMPONENT

ERROR:
" Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'undefined'. Current value: '5af746cea7008520ae732e2c'.
    at throwErrorIfNoChangesMode (core.js:8147)"

    https://blog.angular-university.io/angular-debugging/
    "Expression has changed after it was checked": Simple Explanation (and Fix)
*/

                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: any) => {
                            console.log('SERVICE.getArticle 3333!');
                            console.log('9999 getArticle. articleIGot: BE naming convention: ', articleIGot);
                            /* Yep:  BE NAMING CONVENTION
                            articlePhotos: Array(1)
0: "["justsomestring-in-an-array"]"
length: 1
__proto__: Array(0)
articleTitle: "Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "myhttp"
__v: 0
_id: "5af746cea7008520ae732e2c"
                             */

                            this.articleHereInDetailPage = articleIGot; // BOOM.
                            /* N.B.
                            We can ("Boom") use the server-side 'BE' naming convention
                            *directly* on the HTML template (y not).
                            No special need to "convert" to our client-side 'FE' naming
                            convention - something that we do do to use the
                            article object's data/properties in our TypeScript code,
                            when that is needed.
                            e.g. BE-to-FE Converting:
                              articleTitle_name: whatIGot[0].articleTitle,
                              ^^^^^^^^^^^^^^^^^              ^^^^^^^^^^^^
                              FE                             BE

                            cf. example where we DO do the "converting":
                            src/app/articles/article-add/article-add.component.ts:174
                             */

/* NAH. Worked, but not necessary.
                            this.articleAsOneItemArrayHereInDetailPage.push( articleIGot);
*/
                            /* No Longer Using
                            Above (I guess?) was an odd experiment I didn't really need to run.
                            It worked, but, we don't need to artificially put the one Object
                            onto an Array, just so we can use *ngFor, to access its properties on
                            the template.
                            No.
                            We can just access the damned properties on the Object directly. hmmph.
                            <p>{{ articleHereInDetailPage.articleTitle}}</p>
                             */




                            /* ========================================
                               *  NGRX Experiment  *
                               * Instead of .emit(), we'll use
                               *  Store.dispatch()
                             */

/* WRONG CONSTRUCTOR SIGNATURE ! (o la) ("Cost me an hour")
                            this.myStore.dispatch(new UIActions.TellingYouMyId(articleIdHereInDetailPage));
*/
                            this.myStore.dispatch(new UIActions.TellingYouMyId(
                                {myIdIsInAction: articleIdHereInDetailPage}
                            ));
                            // SENDING TO NGRX STORE.


                            /* Seen in Redux Tool: yes the Action data look good:
                            {
  myPayload: '5af746cea7008520ae732e2c',
  type: '[UI] Telling You My Id'
}

But then, sadly, the Store 'state' somehow ( ? ) *loses* this property of articleIdIs:
{
  uiPartOfStore: {
    sidenavIsOpen: false,
    isLoading: false,
                           // <<<<<<<<<< Where did articleIdIs go ??
    areWeEditing: false
  }
}
                             */

                            // THEN, THE ARTICLES.COMPONENT WILL
                            // "SELECT" IT TO OBTAIN OBSERVABLE
                            // TO ITS VALUE. :o)

                            // Take three: ("the charm") :)  We actually have the article back from the BE Service. bueno
/*  NO LONGER. NOW NGRX. THIS DID WORK FINE.
                            this.tellingYouMyId.emit(articleIdHereInDetailPage);
*/
                            // SENDING TO PARENT ARTICLES.COMPONENT





                                                    // Take FIVE: ("the charm") :)?
                                                    // Below is used to SEND TO PARENT that we are editing,
                                                    // to disable that "Edit Article" link up on ArticlesComponent

/* No Longer
                                                    if (this.areWeEditing) { // << But, need to check difference between /:_id and /:_id/edit !
*/

/* NO LONGER NOW NGRX
                                                        this.weAreEditingNow.emit(true);
                                                        // SENDING TO PARENT ARTICLES.COMPONENT
*/
/* No Longer
                                                    } // /if()
*/
                                                    // =================================================

                                                }
                                            ); // /.subscribe()  ...Service.getArticle()


                        /* NO
                                        this.articleAsObservableHereInDetailPage$ =
                        */
/* NO NO WAY
                    this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGotSecond) => {
                        this.articleAsObservableHereInDetailPage$ = articleIGotSecond;
                        }
                    )*/
            }
        ) // /.subscribe()
    } // /getArticle()

    getArticleViaSubscribe() {
        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                const articleIdHereInDetailPage = paramsIGot['article_id'];
                /* ^^
                That 'article_id' param name is
                 determined in the (Article) Routing Module
                 */
                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: Article) => {
                            console.log('9999 getArticle. articleIGot: ', articleIGot);
                            this.articleHereInDetailPage = articleIGot; // whamma-jamma?
                            console.log('9999 getArticle. this.articleHereInDetailPage ', this.articleHereInDetailPage);
                        }
                    );
            }
        )
    }

    ngOnDestroy() {
/* No Longer
        this.areWeEditing = false;
*/

        // Will try first here in ngOnDestroy() of (child) ArticleDetailComponent
        // instead of over in (parent) ArticlesComponent
        this.myStore.dispatch(new UIActions.TellingYouIfWeAreEditing({areWeEditingInAction: false}));

    }

}
