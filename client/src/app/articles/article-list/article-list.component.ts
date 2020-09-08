import { Component, OnInit, AfterViewInit, Input, Output, Inject, NgZone } from '@angular/core';
/* CRAP
import { PageScrollService } from 'ngx-page-scroll-core';
*/
/*
NEW Scroll biz... (hopefully NOT Crap) (See Also ScrollTopComponent)
 */
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';

import { Category, CategoriesFromEnumLikeClassInModel } from '../article.model';
import { ArticleAddComponent, MyCategoriesEnumLikeClass } from '../article-add/article-add.component'; // re: categories fixer. hmm.

import { ArticleService } from '../article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';

import {Article} from "../article.model";
import {calcPossibleSecurityContexts} from "@angular/compiler/src/template_parser/binding_parser";


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, AfterViewInit {

    articles: Article[]; // empty to begin
    articlesToDisplay: Article[]; // be that ALL, or FILTERED

    latestArticleDate: Date;
    latestArticleAnchorId: string; // articles[articles.length - 1].articleId_name
    articlesCount: number;
    noArticlesInCategory = false; // init
    noArticlesInCategoryWhichCategory: string; // e.g. 'Arts' when there are 0 articles
    articlesInCategoryWhichCategory = 'All Articles'; // init  // string; // e.g. 'Politics' when there ARE articles

    // PAGINATION biz
    updateCurrentPageNumber: number;
    updatePageSize: number;
    updateArticlesCount: number;

    currentPageNumber: number; // 1-based...

    /* PAGESIZE Notes:
    - UPDATE. Below is WRONG-O.
    - I get NaN for the "Last" button when pageSize is merely declared and typed but not initiated.
    We will simply match the default pageSize value also used in PaginatorComponent: 5
    === WRONG. (solly) ============
    - Apparently, unlike RangeAround, we do NOT have to
    initialize pageSize here in Parent. (We do in Child Paginator).
    - But we DO have to have the variable here. ok.
     */
/* WRONG-O.
    pageSize: number;
*/
    pageSize = 5; // default value; see also PaginatorComponent (uses same)

    /*  RANGE_AROUND Notes
    (on each side of currentPageNumber)
    - Value can only be 1 or 2.
    - Appears this value must be initialized in
    both Parent ArticleList, and in Child Paginator.
    Not quite sure why. o well.
    - The value in Paginator "wins" if they do differ. But I just put both to same '2'
    - Paginator 'top' does NOT have RangeAround select
    - Paginator 'bottom' does.
    - When user changes RangeAround value, bottom Child
    emits event that Parent (ArticleList) listens for.
    Parent then updates the (two) Child Paginator
    components with that new RangeAround value - thus the
    ignorant 'top' Paginator learns what RangeAround to
    be using.
    cheers.
    (Similar btw for PageSize (5, 10, 20).)
     */
    rangeAroundSelected = 2; // our default
    RANGE_AROUND = this.rangeAroundSelected;

    /* Hmm. Good idea? Not good idea?
        https://stackoverflow.com/questions/48450349/math-function-not-working-in-angular-4-html
        YES WORKS KINDA KOOKY KRAZY
    */
    MyJavaScriptMath = Math; // << ??

// *** SCROLL BIZ  ***
    myWindowScrolled: boolean;
    scrollOffsetWeJustGotToDisplay: number;
    scrollPositionRounded: number;

categories: Category[];

@Output()
testOutputDoesNotDoAnythingOnList: string;

@Input('articleListOnWelcomePage')
articleListOnWelcomePage: boolean; // From WelcomeComponent

articleListOnArticlesListPage: boolean; // From routerLinks {data}
// Links from 3 locations: Header, Sidenav, ArticlesComponent

testArticles = [
{
articleId_name: 'article-list', // 'one_id',
articleTitle_name: 'Article One',
articleUrl_name: 'http://nytimes.com/one',
},
{
articleId_name: 'two_id',
articleTitle_name: 'Article Two',
articleUrl_name: 'http://nytimes.com/two',
},
{
articleId_name: 'three_id',
articleTitle_name: 'Article Three',
articleUrl_name: 'http://nytimes.com/three',
},
];

categoryThatMatches: Category;

constructor(
private myArticleService: ArticleService,
private myFilterSortService: FilterSortService,
// private myPageScrollService: PageScrollService, // << CRAP
/* Nah
@Inject(DOCUMENT)
private myDocument: Document,
*/
private myScrollDispatcher: ScrollDispatcher,
private myNgZone: NgZone,
  ) { }

  ngOnInit(): void {

      /* ***********
      We are checking if this ArticleListComponent is
      being loaded into the page:
      - "Welcome"? /    << via @Input param passed
      - "Articles List"? /articles/list/  << via history.state.data
       */
      if (history.state.data) {
          if (history.state.data.articleListOnArticlesListPage) {
              this.articleListOnArticlesListPage = true;
          }
      }

      this.categories = this.myArticleService.getCategoriesInService();

      this.currentPageNumber = 1; // init, "1"-based.

      this.getArticlesPaginated(this.currentPageNumber, this.pageSize)
/* Too Early!
      this.generateArticlesPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);
      console.log('this.paginationButtonsArray ', this.paginationButtonsArray);
*/
      /*
      []  << :o(  articlesCount is undefined. Need to invoke this LATER, not right here
       */

  } // /ngOnInit()


    ngAfterViewInit() { // NO LONGER USED

    /* This line was live, in here, but, I think (see below) it was wrong. o well.
        this.myPaginatorScrollToTop();
*/
        /*
        Hmm. No longer using all this scroll stuff from here in
        ArticleListComponent anyway, (we now (re-)use ScrollTopComponent)
         but, wasn't this line above supposed
        to be calling this instead ??
        >>>      this.myPaginatorScrollToTopInit(); <<< ?

        Would appear I didn't really have this running right; I think?
        Hmm, bit embarrassing maybe. o well. no longer using.
        good night.
        */
    }

    getArticles() {
        // << OLDER. ALL. pre-PAGINATION.
        // OLDER: Service returns 'Observable<Object>', to which we .subscribe()
        // Notes below on how we TYPE what is returned. Veddy carefully.

        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.myArticleService.listArticles()
            .subscribe(
                (allArticlesWeGot:
                     [ {
                         _id: string,
                         articleTitle: string,
                         articleUrl: string,
                         articleCategory: string,
                     }]
                ) => {
                    /* WAY CRAZY FINDING
                    Ok. Over in Service, been messing with return types of Observable<Object>, Observable<object>, Observable<any>
                    And here in the Component, types here inside .subscribe(),
                    of: Object, object, any, and []
                    But, above, see how I can very explicitly "type" what
                    we get back: [{}] with exact properties on that object.
                    Very nice.
                    (Here is where, if it were worth it, you would/could
                    create (yet another) model. e.g. "BEArticle" or such.)
                    cheers.
                     */
                    // << But WS IDE (apparently) lets me "override" ( ? ) the type as [] y not I guess ? Hmm
                    // (allArticlesWeGot: Object) => { // << WS IDE automagically types this as : Object, or : object, depending on my Service method return type. ok.

                    console.log('allArticlesWeGot ', allArticlesWeGot);
                    /* Yes. [{}]
                         [{…}, {…}, ]
                     */

                    /*
                    BE-to-FE Converter
                    BE naming convention: articleTitle
                    FE naming convention: articleTitle_name

                    (and don't forget the FE *FORM* naming convention:
                    articleTitle_formControlName)

                    And, now, CATEGORY FIXER too!
                     */

                    this.articles = allArticlesWeGot.map(

                        (eachPseudoArticleFromApi: {
                            _id: string,
                            articleTitle: string,
                            articleUrl: string,
                            articleCategory: string,
                        }) => {

                            let eachRealArticleToReturn: Article;

                            /* CATEGORY FIXER
      Go get 'viewValue' for the (stored) 'value' returned from the DB.
      e.g. 'u.s.' as value will return 'U.S.' as viewValue
       */
                            let categoryViewValueSuchAsItIsReturned: string;

                            categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(eachPseudoArticleFromApi.articleCategory);
                            /*
                            Returns 'viewValue' e.g. 'No Category (thx Service!)' --OR-- category viewValue
                             */

                            eachRealArticleToReturn = {
                                articleId_name: eachPseudoArticleFromApi._id,
                                articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                                articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                                articleCategory_name: categoryViewValueSuchAsItIsReturned,
                            }

                            return eachRealArticleToReturn;
                        }
                    ) // /allArticlesWeGot.map()

                    this.articlesToDisplay = this.articles; // whamma-jamma the "pagesize" # of them on, to begin

                    this.latestArticleDate = this.myDateFromObjectId(this.articles[this.articles.length - 1].articleId_name);
                    this.latestArticleAnchorId = this.articles[this.articles.length - 1].articleId_name;

                } // /next(allArticlesWeGot)

            ); // /listArticles.subscribe()

        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    } // /getArticles() << OLD. PRE-PAGINATION


    getArticlesPaginated(page, pagesize) {
        // NEWER: Service ALSO returns 'Observable<Object>', to which we .subscribe()
        // Notes below on how we TYPE what is returned. Veddy, veddy carefully.

        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // TODO: SPINNER HERE!
        this.myArticleService.listArticlesPaginated(page, pagesize)
            .subscribe(
                (allArticlesWeGot: {
                     articlesPaginatedFromServer: [],
                     maxArticlesFromServer: number,
                 }
                 // allArticlesWeGot: any // << Yes. this typing
/* Yes.  this typing
                     allArticlesWeGot: {
                         articlesPaginatedFromServer: [],
                         maxArticlesFromServer: number,
                     }
*/
                 /*
                 Typing as 'any' works.
                 Typing as full Object literal/interface (above) works.
                 Leaving to default type of ': Object' or ': object' does not work.
                  */
                     ) => {

                    /* HERE IS WHAT WE GET! (NEW for PAGINATION)
                    {
                        articlesPaginatedFromServer: dataWeGotFromServer.articlesPaginated,
                        maxArticlesFromServer: dataWeGotFromServer.maxArticles,
                    }
                     */
                    // console.log('Paginated. allArticlesWeGot {} ', allArticlesWeGot);
                    /* Yes.
                      {
                          articlesPaginatedFromServer: Array(5),
                          maxArticlesFromServer: 99
                       }
                     */


                    this.articlesCount = allArticlesWeGot.maxArticlesFromServer;
                    // this.articlesCount = this.HARD_CODED_SMALLER_NUMBER_OF_ALL_ARTICLES_IN_COLLECTION; // like, 15, instead of 99

                    // You could do generateArticlesPaginator() from here .... but I'll do at bottom of this method

                    this.currentPageNumber = page;

                    /* What a nicens little bug!
                    I was failing to UPDATE this.pageSize here in the Parent Component (ARTICLELIST),
                    when I'd changed it down in the Child Component (PAGINATOR).
                    O la.
                    For "rangeAround" value change, Not Needed to update the Parent!
                    So that was working FINE. << Hmm, found another nicens little bug regarding RangeAround. In midst of fixing, j'espere.
                    Okay - the updating of RangeAround does not
                    take place here. Here we update pageSize,
                    in the middle of fetching Articles - appropriate.
                    Each fetch depends on pageSize (and page #). Ok.
                    But RangeAround is not changed w. every fetch.
                    RangeAround only needs updating on explicit user click
                    to "change the range around"
                    See other method:
                    updateRangeAroundToTopPaginator()
                     */
                    this.pageSize = pagesize; // "pagesize passed-in", from Child to Parent

                    this.articles = allArticlesWeGot.articlesPaginatedFromServer.map(
                        this.myArticleService.myMapBEArticlesToFEArticles
                    );
                    /* Refactored to Service.
                    Two Components now can use: this ArticleList, and also ArticleDetailTwo.

                    Simple tip on "Naming callback functions" helped me get syntax for refactoring here:
                    https://levelup.gitconnected.com/javascript-refactoring-tips-making-functions-clearer-and-cleaner-c568c299cbb2
                     */

/* Now this is over in Service, as named (callback) function: myMapBEArticlesToFEArticles()
cheers.
                    this.articles = allArticlesWeGot.articlesPaginatedFromServer.map(
                        (eachPseudoArticleFromApi: {
                            _id: string,
                            articleTitle: string,
                            articleUrl: string,
                            articleCategory: string,
                        }) => {

                            let eachRealArticleToReturn: Article;

                            /!* CATEGORY FIXER
      Go get 'viewValue' for the (stored) 'value'
      returned from the DB.
      e.g. 'u.s.' as value will return 'U.S.' as viewValue
       *!/
                            let categoryViewValueSuchAsItIsReturned: string;

                            categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(eachPseudoArticleFromApi.articleCategory);
                            /!*
                            Returns 'viewValue' e.g. 'No Category "viewValue" (thx Service!)' --OR-- category viewValue
                             *!/

                            eachRealArticleToReturn = {
                                articleId_name: eachPseudoArticleFromApi._id,
                                articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                                articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                                articleCategory_name: categoryViewValueSuchAsItIsReturned,
                            }

                            return eachRealArticleToReturn;
                        }
                    ) // /allArticlesWeGot.map()
*/

                    this.articlesToDisplay = this.articles; // whamma-jamma the "pagesize" # of them on, to begin

                    this.latestArticleDate = this.myDateFromObjectId(this.articles[this.articles.length - 1].articleId_name);
                    this.latestArticleAnchorId = this.articles[this.articles.length - 1].articleId_name;

                    // this.generateArticlesControlledPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);
                    // Above SUPERSEDED by next line...

                    /*
                    The method below is called on every click from Paginator.
                    =======================
                    WAS NAMED:    updateRedrawArticlesControlledPaginator
                    NOW IS NAMED: updateArticlesControlledPaginator
                    RATIONALE:
                    - Really the "redraw" part happens on the PaginatorComponent, in its own method named updateRedrawHereArticlesControlledPaginator().
                    - In this ArticleListComponent, we just update it, passing in the 3 parameters. But redrawing it happens
                    in the child PaginatorComponent. cheers.
                    =======================

   That is, when the user, in the child Paginator HTML
   clicks any Paginator button, it runs emit...(),
   and that emit...() method causes the @Output EventEmitter
                    do its emitting.
                    The parent component
                    ArticleList receives that, and runs its
                own getArticlesPaginate() (the method we
                     are in right here), which in turn
                     runs the line below to update...() the paginator - essentially by passing the 3 needed
                     parameters back *down* as @Inputs
                     to the child Paginator again.
                     A round trip of sorts, with newly
                     fetched Articles data, appropriate
                     to the requested page
                     (which page #, how many Articles/page,
                     how many Articles overall in Collection)
                     .Whew & cheers.
                      */
                    this.updateArticlesControlledPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);

                } // /next(allArticlesWeGot)

            ); // /SERVICE.listArticlesPaginated.subscribe()
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    } // /getArticlesPaginated()

    updateArticlesControlledPaginator(currentPageNumber, pageSize, articlesCount) {
        /*
INITIAL TIME:
currentPageNumber: 1 default
pageSize: 5 default
articlesCount: dynamic (collection size)

SUBSEQUENT TIMES:
currentPageNumber: 'page' passed-in (DIFFERENT by definition!)
pageSize: 'pageSize' passed-in (usually unchanged, but...)
articlesCount: dynamic (collection size) (changes infrequently)
 */

        this.updateCurrentPageNumber = currentPageNumber;
        this.updatePageSize = pageSize;
        this.updateArticlesCount = articlesCount;

    } // /updateArticlesControlledPaginator


    updateRangeAroundToTopPaginator(rangeAroundFromOutput) {
    /* Yes, needed! (amazing, no?)
    Another "round-trip" - parent to child back up to parent.

    The "back up" part is: Parent here listens (via HTML) for EventEmitter
    from Child's @Output re: 'rangeAroundChangedPaginatorBottomEvent'
    That value we make the RANGE_AROUND here in the parent.
    And that in turn makes a sort of another half-round-trip
    back DOWN to the Paginator child components,
    updating them with what is now the RANGE_AROUND.
    whoa & Etc.
     */
        this.RANGE_AROUND = rangeAroundFromOutput;

        console.log('222 updateRangeAroundToTopPaginator this.RANGE_AROUND ', this.RANGE_AROUND);
    }
/* See PaginatorComponent for the pertinent "LARGE COMMENTS...":

$ git commit -m 'Clean up ArticleListComponent: remove duplicated code now instead in PaginatorComponent. Add LARGE Comments for I. PAGE SIZE and II. RANGE AROUND, re: "round-trip-plus" child-to-parent-to-other-child etc. (!)'

####  I. PAGE SIZE  #################################################
I. PAGE SIZE = How Many Articles on One Page
...
####  II. RANGE AROUND  #############################################
II. RANGE AROUND = How Many Page # Buttons to Left and to Right of CurrentPage
...
     */



    letUsFilterByCategory(categoryStoredValuePassedIn: string) {
        this.noArticlesInCategory = false; // << Make sure to reset!
        this.noArticlesInCategoryWhichCategory = ''; // ditto

        if (categoryStoredValuePassedIn === 'ALL') {
            // SPECIAL CASE. We simply want All Articles.
            // No consideration re: Category (or "No Category Assigned") value. All of 'em.
            // We do NOT call the Filter Service
            this.articlesToDisplay = this.articles;
            this.articlesInCategoryWhichCategory = 'All Articles';

        } else {

            let articlesFilteredFromService: any[];

            articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles, 'articleCategory_name', categoryStoredValuePassedIn)

            if (categoryStoredValuePassedIn === 'No Category (thx Service!)') { // << special case, kids
                this.articlesInCategoryWhichCategory = 'No Category Assigned';
            } else {
                this.articlesInCategoryWhichCategory = categoryStoredValuePassedIn;
            }

            this.articlesToDisplay = articlesFilteredFromService;
        }

        this.articlesCount = this.articlesToDisplay.length;

        if (this.articlesCount === 0) { // e.g. right now, 0 articles under "Arts" (sigh)
            this.noArticlesInCategory = true;
            this.noArticlesInCategoryWhichCategory = categoryStoredValuePassedIn;
        }

} // /letUsFilter()

// Now in our DateService (under /core/services)
/* NOT CALLED FROM HERE
    // https://steveridout.github.io/mongo-object-time/

    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };
 */

    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

}
