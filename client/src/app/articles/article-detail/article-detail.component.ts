import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
import {BehaviorSubject, Observable} from 'rxjs'; // << ?? t.b.d.
import { map, tap } from 'rxjs/operators';
/* ??
import {url} from "inspector";
*/

@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {

    /*
    CHILD-to-PARENT "Communication" ** by way of <router-outlet> **
    https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
     */
    /* N.B.
Now handling TWO different events/pieces-of-info:
1. Here is the _id for the article in ArticleDetailComponent. (Use that _id to set the /:_id/edit link)
2. User has now clicked on that /edit URL, so shift to weAreEditing to TRUE. (Use that to disable the Edit link)
*/
    // 1.
    @Output()
    tellingYouMyId: EventEmitter<string> = new EventEmitter<string>();

    // 2.
    @Output()
    weAreEditingNow: EventEmitter<boolean> = new EventEmitter<boolean>();


    urlHereToSeeWhetherEditingObservable$: Observable<string>; // ugh worked with | async, but *not* making it go in TS logic. urgh
    urlHereToSeeWhetherEditingBehaviorSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('FAKEURL');
    urlHereAsObservableFromBehaviorSubject$ = this.urlHereToSeeWhetherEditingBehaviorSubject$.asObservable();
    urlHere: string;
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
            console.log('Constructor. PIPE off ActivatedRoute.url. this.urlHere ', this.urlHere); // undefined << ?? Now FAKEURL

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
    }

    ngOnInit() {
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
            (urlFromActivatedRoute) => {
                console.log('GetArticle. .Subscribe. off urlHere$. we get: urlFromActivatedRoute ', urlFromActivatedRoute); // << YES. Finally fucking works. 5af746cea7008520ae732e2c
                this.urlHereToSeeWhetherEditingBehaviorSubject$.next(urlFromActivatedRoute);
                this.urlHere = urlFromActivatedRoute;
                console.log('blah. SUBSCRIBE this.urlHere ', this.urlHere); // YES. 5af746cea7008520ae732e2c/edit
                // REGEX TIME
                if (this.urlHere.match(/\/edit$/g)) {
                    // https://regexr.com/  https://regex101.com/  :)
                    console.log('RegEx SUBSCRIBE WORKS WORKS WORKS passed we are editing seems');

                    // =================================================
                    this.areWeEditing = true; // << YES this logic works, etc. bueno.
                    // Above is used LOCALLY here on the ArticleDetailComponent HTML as flag

                    // Take FOUR: ("the charm") :)? << NO. Hitting dumb error "Expression Changed" = TOO SOON.
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

                // ?? Do we need to return anything?  Didn't break stuff. Hmm.
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


                            // Take three: ("the charm") :)  We actually have the article back from the BE Service. bueno
                            this.tellingYouMyId.emit(articleIdHereInDetailPage);
                            // SENDING TO PARENT ARTICLES.COMPONENT

                            // Take FIVE: ("the charm") :)?
                            // Below is used to SEND TO PARENT that we are editing,
                            // to disable that "Edit Article" link up on ArticlesComponent
                            if (this.areWeEditing) { // << But, need to check difference between /:_id and /:_id/edit !
                                this.weAreEditingNow.emit(true);
                                // SENDING TO PARENT ARTICLES.COMPONENT
                            }
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
        this.areWeEditing = false;
    }

}
