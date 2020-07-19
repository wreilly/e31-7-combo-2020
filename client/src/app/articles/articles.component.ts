import { Component, OnInit, AfterViewInit } from '@angular/core';

/*
https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
 */
import { Router } from '@angular/router'; // ActivatedRoute
/* re: <router-outlet on-activate=""> see:
https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89

 */
import { Article } from './article.model';
import { ArticleService } from './article.service';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  articleMostRecentDisplayBE: {
    _id: string,
    articleTitle: string,
    articleUrl: string,
  };
  articleMostRecentDisplayFE: Article;

  articleToEditId: string;

  constructor(
      private myArticleService: ArticleService,
      // myActivatedRoute: ActivatedRoute,
      private myRouter: Router,
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


  } // /ngOnInit()

/*
  ngAfterViewInit() {
    console.log('AFTER VIEW Kids 01 & this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
    if (!this.articleMostRecentDisplayFE) {
      console.log('AFTER VIEW Kids 02');
      this.getArticleMostRecent(); // ?? NO. does not run "navigating" back to /articles ?
    }
  }
*/

/*
  ngOnChanges() {
    /!*
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
  }
*/

  myOnActivate(componentReferenceFromRouterOutlet) {
    // https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
    console.log('componentReferenceFromRouterOutlet ', componentReferenceFromRouterOutlet);


    if(componentReferenceFromRouterOutlet.tellingYouMyId) {
      // Only ArticleDetailComponent has that property ^^
      // The other possible Components passed to this <router-outlet> won't have it

      // tellingYouMyId is an EventEmitter. You can subscribe to its events (stream)
      componentReferenceFromRouterOutlet.tellingYouMyId.subscribe(
          (dataWeGet) => {
            this.articleToEditId = dataWeGet; // MongoDB _id
          }
      )
    }
  }

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
              this.articleMostRecentDisplayFE = {
                articleId_name: whatIGot[0]._id,
                articleTitle_name: whatIGot[0].articleTitle,
                articleUrl_name: whatIGot[0].articleUrl
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


}
