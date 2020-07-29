import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';

// ****   FORM for EDIT MODE  **********
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// Interesting. Above not needed; we get it from ArticleAddComponent instead as "My"...
import { MyErrorStateMatcher, MyCategoriesEnumLikeClass } from '../article-add/article-add.component';
/* MyCategoriesEnumLikeClass, for that "HowManyCharsTyped()" business:
Hokey, hard-coded, But it DID WORK, to get that value of '20' over from ArticleAddComponent. cheers
*/
// ****   /FORM for EDIT MODE  **********

import { ActivatedRoute, Router } from '@angular/router';

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

    // ****   FORM for EDIT MODE  **********

    /* ~SAME VARIABLE NAMES
    For this first go, we'll copy in
       ~MOSTLY~ the SAME NAMES
    on the variables, from ArticleAddComponent.
    cheers
     */

    myFormFieldsData: FormData = new FormData();

    editArticleFormGroup: FormGroup; // << WAS "addArticleFormGroup" fwiw

    articleTitle_formControl: FormControl;
    articleUrl_formControl: FormControl;
    articleCategory_formControl: FormControl;

    myOwnErrorStateMatcher: MyErrorStateMatcher; // << imported ! very nice.
    myOwnCategoriesEnumLikeClass: MyCategoriesEnumLikeClass;

    // ****   /FORM for EDIT MODE  **********


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
            private myRouter: Router,
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

        // ****   FORM for EDIT MODE  **********

        // INITIATE FormGroup, Controls
        this.articleTitle_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.minLength(10),
            ]);

        this.articleUrl_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.pattern(
                    /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
                ),
            ]);
        /* URL_REGEXP from: (2015)
https://github.com/angular/angular.js/commit/ffb6b2fb56d9ffcb051284965dd538629ea9687a
 */

        this.articleCategory_formControl = new FormControl('News',
            [
                Validators.required,
            ]);

        this.editArticleFormGroup = new FormGroup({
            'articleTitle_formControlName': this.articleTitle_formControl,
            'articleUrl_formControlName': this.articleUrl_formControl,
            'articleCategory_formControlName': this.articleCategory_formControl,
        });

        this.myOwnErrorStateMatcher = new MyErrorStateMatcher(); // << imported. very nice.
/* Hokey, hard-coded, But it DID WORK, to get that value of '20' over from ArticleAddComponent. cheers
        this.myOwnCategoriesEnumLikeClass = new MyCategoriesEnumLikeClass();
*/

        // TODO this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

        // ****   /FORM for EDIT MODE  **********

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


---  2020-07-24   ----------------------
Ah-hah. Hmm. Looks like YEAH we should move this Store Action Dispatch down below (near the other .emit()) cheers
-------------------------
core.js:6228 ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
Previous value: 'undefined'. Current value: 'false'.
It seems like the view has been created after its parent and its children have been dirty checked. Has it been created in a change detection hook?
-------------------------



btw, related question: just *where/when* do we .dispatch the FALSE action that we are No Longer Editing, hey?
For now: in the (parent) ArticleComponent's ngOnDestroy() ? hmm
Soon-(ish): Or of course (in (near) future), could be off the (not yet created) <form> submit from the ArticleDetailComponent in "editMode". Guess that would be a .dispatch to the Store, which would of course get read/known/updated
in the (parent) ArticlesComponent, which would then "do the right thing" to hide the "(Editing)" nav tab bar thing. cheers.
                     */

                    // !!!  TOO  EARLY !!! //
/*
                    this.myStore.dispatch(
                        new UIActions.TellingYouIfWeAreEditing(
                            { areWeEditingInAction: true} // AH-HAH moment. Got to match the danged constructor signature, kids!
                        )
                    );
*/
                    /*
                    above, "Too Early" for NgRx Store Dispatch. OK.
                    But right here, NOT "too early" to simply
                    capture to local Boolean class member
                    that yeah, "we are editing," because
                    we just tested that the URL does contain
                    '/edit'
                    cheers
                    (that is, you'll see below we test on this
                     flag when we go to Dispatch to Store.)
                     */
                    this.areWeEditing = true;

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

But then, sadly, the Store 'state' somehow ( ? ) *loses* this property of articleIdIs:  << Hey, I FIXED THIS.
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
                            /*
                            What Ho! Re-Instating the "Take FIVE"
                            (Take SIX, hey?)
                            That is, we have (once again)
                            learned the Hard Way that the
                            timing for this Store Dispatch
                            (which in turn updates our Observable$)
                          needs to be here, later, not
                          so immediately, as we first tried
                           up above, at beginning of getArticle().
                           Note how we set up that Observable$
                           v. early in constructor() (normal)
                           But something about router-outlet
                           onActivate() ? and this same
                           Component getting re-used/loaded ?
                           for shifting to /edit mode causes
                           too much too early (re)-updating
                           of that Observable etc etc
                           Fix seems to be: delay all that
                           updating by finally only doing it way
                           down here, when the Article has been
                           re-retrieved ? for editing.
                           o la.
                             */
                            if (this.areWeEditing) {
                                /*
                                We need to test for this;
                                we've captured the boolean
                                up above when we looked at the
                                URL for '/edit'
                                 */
                                this.myStore.dispatch(
                                    new UIActions.TellingYouIfWeAreEditing(
                                        {areWeEditingInAction: true}
                                        )
                                );
                            }
                                                    // =================================================

                            /* ***********************************
                                FORM EDIT
                                PatchValue
                                **********************************
                             */
                            /*
                            Another "AH-HAH" moment: PATCH VALUE !!!
Hey! Big Point!
This "patch" biz is ONE WAY.
It puts the value into the input field. Fine.
But it does NOT get you "2-WAY Binding". No.
Maybe you don't need it. Fine. Jus' saying.

--------------------------------------
src/app/article-detail/article-detail.component.ts:173
/Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/client/src/app/article-detail/article-detail.component.ts
--------------------------------------
Service.getArticle() {
	...
// Fill in that REACTIVE editable Form, too!
this.myArticleEditFormGroup.patchValue({
    articleTitle_formControlName: articleIGot.articleTitle
});
...
}
--------------------------------------

https://angular.io/api/forms/FormControl#patchvalue
                             */

                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: articleIGot.articleTitle
                                // N.B. "BE" convention: articleTitle, not FE articleTitle_name. cheers
                            })


                            /* ***********************************
                                /FORM EDIT
                                **********************************
                             */


                                                } // /next(articleIGot)
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
        ) // /.subscribe()  myActivatedRoute.params
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

    processReactiveFormEdit() {
        // ****   FORM for EDIT MODE  **********

        console.log(`TITLE = this.editArticleFormGroup.get('articleTitle_formControlName').value`, this.editArticleFormGroup.get('articleTitle_formControlName').value);
        /*
        Coronavirus 234 Live Updates: Birx Urges Bar Closures and Limits on Gatherings
         */
        console.log(`FORM ENTIRE = this.editArticleFormGroup.value`, this.editArticleFormGroup.value);
        /* Q. Curious. Why is Category retained? (I know why URL is not.) Hmm.
        A. Ah-hah-ho. It is the damned DEFAULT value. Yeesh. (We in fact LOSE our original value, e.g. 'U.S.")

        {articleTitle_formControlName: "Coronavirus 234 Live Updates: Birx Urges Bar Closures and Limits on Gatherings", articleUrl_formControlName: null, articleCategory_formControlName: "News"}
         */

/*
Q. Hmm, is this "navigate" necessary ? don't think so. may put in again, or similar. cheers
A. No. not really needed.

        this.myRouter.navigate(['/']); // navigate away from this page after EDIT Submit() ...
*/

        let myFormFieldsAndFiles: any; // << FormData, but, tricky, so 'any' helps ...
        /*
Phase I. Just FormFields
Phase II. Files too (for Photo(s))
         */

        myFormFieldsAndFiles = this.prepareToEditArticleReactiveForm();

        // const idToPass: string = '5af746cea7008520ae732e2c'; // << Yes of course hard-coded works...
        // const idToPass: string = this.articleHereInDetailPage.articleId_name.value; // << Ooffa. FE convention, not in use at this moment! oi.
        // const idToPass: string = this.articleHereInDetailPage._id.value; // << oi. don't look for ".value"
        const idToPass: string = this.articleHereInDetailPage._id; // << Here you want the (lazy) BE convention. sheesh.
        console.log('WTF & Etc. this.articleHereInDetailPage ', this.articleHereInDetailPage);
        /* Yeah, we have _id:
        articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "myhttp"
__v: 0
_id: "5af746cea7008520ae732e2c"
         */

        this.goEditArticle(idToPass, myFormFieldsAndFiles);
        // Better name: go UPDATE Article ...

    // ****   FORM for EDIT MODE  **********
} // /processReactiveFormEdit()

    private prepareToEditArticleReactiveForm(): FormData {
        /*
        - 1. "Prepare" here means:
           Appends values from form fields onto our
           HTML "FormData" type

        - 2. A sort of "mapping" occurs, from:
           - naming convention for form fields "_formControlName", to:
           - naming convention for FE Article "_name"
           (Note that there will be another "mapping"
           later, from the FE convention, to the BE
           convention, for sending to the BE/API/DB.)
           BE drops the "_name" (e.g. articleTitle)

        - 3. Returns that FormData.
        */

        console.log('o la prepare EDIT 00 this.editArticleFormGroup.controls[\'articleTitle_formControlName\'].value ', this.editArticleFormGroup.controls['articleTitle_formControlName'].value);
        /* YES
        Trump’s Uncle Brendan WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers
         */

        this.myFormFieldsData.append(
            'articleTitle_name',
            this.editArticleFormGroup.controls['articleTitle_formControlName'].value
        );

        this.myFormFieldsData.append(
            'articleUrl_name',
            this.editArticleFormGroup.controls['articleUrl_formControlName'].value
        );

        this.myFormFieldsData.append(
            'articleCategory_name',
            this.editArticleFormGroup.controls['articleCategory_formControlName'].value
        )

        console.log('o la. prepare EDIT this.myFormFieldsData: ', this.myFormFieldsData); // hmm. FormData {}
        /* YES we do have the data here. very good.
        O la. Need that XHR-2-FAKE.URL to debug FormData, people. sigh.
        -- OR --
        just (lazily) use that Chrome DevTools Network Headers FormData:
        -----
        ------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleTitle_name"

Trump’s Uncle Brendan WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers
------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleUrl_name"

null
------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleCategory_name"

News
------WebKitFormBoundaryfNJTOZUW1y6QoaUw--
        -----
      */

        return this.myFormFieldsData;
    } // /prepareToEditArticleReactiveForm()

    goEditArticle(idPassedIn, myFormFieldsAndFiles): void {
        /*
            - 1. "Go Edit" here really means Go UPDATE:
                   Go to the Service
                   (which in turn does XHR to the BE API)
                   to UPDATE ("Edit") the Article
                   on the BE/DB

            - 2. No 'return' (void)
         */

        this.myArticleService.updateArticle(idPassedIn, myFormFieldsAndFiles)
            .subscribe(
                (whatWeGotBackFromUpdate) => {
                    console.log('whatWeGotBackFromUpdate BE ', whatWeGotBackFromUpdate);

                    /* TODO (maybe)
                    BE-to-FE convert, to DISPLAY result on FE << NAH

                    -- OR --
                    just navigate away from this page ? T.B.D. << YAH
                     */

                    this.editArticleFormGroup.reset(); // << hmm. not what we want ?
                    this.myRouter.navigate([`/articles/${idPassedIn}`]); // back to page we just edited

                },
                (errWeGot) => {
                    console.log('updateArticle. errWeGot ', errWeGot);
                    console.log('updateArticle. errWeGot.message ', errWeGot.message);
                },
                () => {
                    console.log('updateArticle. complete. that\'s it. eom.');
                }
            );

    } // /goEditArticle()

    letUsDelete() {
        const idToDelete = this.articleHereInDetailPage._id;
        if(confirm('Are you sure you want to Delete?')) {
            this.myArticleService.deleteArticle(idToDelete)
                .subscribe(
                    (whatIGotDeleting) => {
                        console.log('whatIGotDeleting ', whatIGotDeleting); // null  hmm. << again! wtf
                        /* Better!
                        {
                        articlePhotos: ["["sometimes__1527882425725_09dc-Autos-1-jumbo.jpg"…_fbde38d7-df32-4801-9c88-c9111e7084d7-jumbo.jpg"]"]
articleTitle: "gtyhbnmmj888888"
articleUrl: "null"
__v: 0
_id: "5b11a2bac21542eb8a213c18"
                        }
                         */

                        this.myRouter.navigate(
                            ['/articles'],
                            {
                                state: {
                                    data: {
                                        articleMostRecentHideRouterLinkState: false
                                    }
                                }
                            }
                            );

                    },
                    (errIGotDeleting) => {
                        console.log('errIGotDeleting ', errIGotDeleting)
                    },
                    () => {
                        console.log('Deleting, complete()'); // << yep
                    }
                );
        }
    }

    letUsCancelEditing() {
            console.log(this.articleHereInDetailPage);
            /* RECALL: "BE" Naming Convention!

            articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s show me show me show me EDITED THE HELL BACK OUT (that's better) OFFICE WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONES,lopTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "null"
__v: 0
_id: "5af746cea7008520ae732e2c"
             */

/* NO. Not "FE" Naming Convention....
            this.myRouter.navigate([`/articles/${this.articleHereInDetailPage.articleId_name.value}`]);
*/

        // YES. "BE" Naming Convention:
        this.myRouter.navigate([`/articles/${this.articleHereInDetailPage._id}`]);

    }

// **********  UTILITIES  *****************
myHowManyCharsTyped(formControlNamePassedIn: string):number {
        let howMany;
        /*
        Clever little code: boolean expression both must be true/truthy "&&"
        - test whether there IS any "value" (string) in that FormControl, right now
        - get its length. that's what you're sending back. cheers
         */
            howMany = (
                this.editArticleFormGroup.get(formControlNamePassedIn).value
                &&
                this.editArticleFormGroup.get(formControlNamePassedIn).value.length
            );
            return howMany;
    }

    ngOnDestroy() {
/* using (again) now */
        this.areWeEditing = false;


        // Will try first here in ngOnDestroy() of (child) ArticleDetailComponent
        // instead of over in (parent) ArticlesComponent
        this.myStore.dispatch(new UIActions.TellingYouIfWeAreEditing({areWeEditingInAction: false}));

    }

}
