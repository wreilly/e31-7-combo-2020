import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import { Article, Category } from '../article.model';
import { ArticleService } from '../article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';

@Component({
  selector: 'app-articles-categorized',
  templateUrl: './articles-categorized.component.html',
  styleUrls: ['./articles-categorized.component.scss']
})
export class ArticlesCategorizedComponent implements OnInit {

  articles: Article[]; // empty to begin
  articlesToDisplay: Article[];
  // Be that ALL, or Filtered

  articlesCountAllInCollection: number;
  articlesCount: number; // in a Category
  articlesInCategoryWhichCategory = 'All Categories'; // init  // string; // e.g. 'Politics' when there ARE articles

  filterIsOn = false; // init
  filterCategory: string; // init ? '';
  /* ? should it be 'ALL Articles'
  (or 'ALL Categories' for that matter) ?
  - Seems not necessary
   */

  // LOAD MORE
  offsetPageSize = 20; // HARD-CODED. Matches BE
  /*
  routes/api/api-articles.js:145
  const pageSize = 20; // hard-coded. 20 articles per "Load More" page.
   */

  offsetNumber = this.offsetPageSize;// 0; // init. Also in ngOnInit()
  articlesShownNumber: number;
  loadNoMore: boolean; // disable when max articlesShownNumber



  offsetNumberNext: number; // << Not using (after all)
  /* Update on Note below.
  Changed my mind. Not using 'offsetNumberNext' any more.
  Why?
  On U/I to display "Showing: Articles 1 - 20" ( or 40, or 60),
  this use of "next" was causing more trouble than worth.
  Just "offsetNumber" better reflects the, well, offsetNumber.
   */
  /* Note: << SEE ABOVE UPDATE. Not doing this now.
  We sort of don't need "offsetNumberNext".
  We could just update "offsetNumber" (from 0, to 20, to 40, etc.)
  The "next" naming I suppose helps (?) convey sense
  of what that "number" figure is doing,
  there on the click-button...

  In any event, with this "next" variable,
  we wind up leaving behind the initial "offsetNumber"
  unchanged, unused, after first load of 20.
  After that, it is "offsetNumberNext" that
  continually gets updated.

  Again, could have done all of above w. just
  "offsetNumber". okay.
   */



  categories: Category[];
  noArticlesInCategory = false; // init
  noArticlesInCategoryWhichCategory: string;
  // e.g. 'Arts' when there are 0 articles in Arts

  myUIIsLoadingStore$: Observable<boolean>;

  constructor(
      private myArticleService: ArticleService,
      private myFilterSortService: FilterSortService,
      private myStore: Store,
  ) { }

  ngOnInit(): void {

    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

    this.categories = this.myArticleService.getCategoriesInService(); // whamma-jamma

    this.offsetNumber = this.offsetPageSize;
    /* // be sure to re-initialize, here. bueno.
    Hah. you don't want 0;
    N.B. MongoDB limit(0) is same as NO limit. o la!
     */

    // this.getArticles();
    this.getArticlesLoadMore(this.offsetNumber); // init with offsetNumber of 0. (Get first twenty --> 0-19)

  }

  getArticles() { // << NO LONGER CALLED. NOW "LOAD MORE"
    this.myArticleService.listArticles()
        .subscribe(
            (allArticlesWeGot: []) => {
              console.log('allArticlesWeGot ', allArticlesWeGot);
              /* [] of {} = OK
articleCategory: "u.s."
articleTitle: "Covid-19EDIT jjj kkk NAV ARTICLES Live Updates: a One More Vaccine Trial Is Halted After Patient Becomes Ill"
articleUrl: "https://www.nytimes.com/2020/09/09/world/covid-19-coronavirus.html"
__v: 0
_id: "5f58ae8d4d2835ae66510f4a"
               */

              /* Hmm. Error:
"core.js:6228 ERROR TypeError: allArticlesWeGot.map is not a function"

              (allArticlesWeGot: [
                { // "BE Article"
                  _id: string,
                  articleTitle: string,
                  articleUrl: string,
                  articleCategory: string, // << BE 'value' e.g. 'u.s.'
                }
              ]) => {
*/

              // HMM. this.articlesCount = allArticlesWeGot.length;

/* HMM. */
              this.articles = allArticlesWeGot.map(
                  this.myArticleService.myMapBEArticlesToFEArticles
              );


              this.articlesToDisplay = this.articles; // whamma-jamma

              this.articlesCount = this.articlesToDisplay.length;

            }
        ) // /.subscribe()
  } // /getArticles() // << NO LONGER CALLED.

  getArticlesLoadMore(offsetNumberHere) {

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    /* SPINNER triggered from here, arguably.
       But spinner-related code is elsewhere:
    - Spinner ~dispatch.startLoading is over in ArticleService
    - Spinner setTimeout() -> ~dispatch.stopLoading is over in ArticleService
    - Spinner <mat-progress-spinner ~isLoading$|async> is in ArticlesCategorizedComponent template
     */

    this.myArticleService.listArticlesLoadMore(offsetNumberHere)
        .subscribe(
            (loadMoreArticlesWeGot: {
              articlesLoadMoreFromServer: [],
              maxArticlesFromServer: number,
            }) => {
              console.log('loadMoreArticlesWeGot ', loadMoreArticlesWeGot);
              /* [] of {} = OK
articleCategory: "u.s."
articleTitle: "Covid-19EDIT jjj kkk NAV ARTICLES Live Updates: a One More Vaccine Trial Is Halted After Patient Becomes Ill"
articleUrl: "https://www.nytimes.com/2020/09/09/world/covid-19-coronavirus.html"
__v: 0
_id: "5f58ae8d4d2835ae66510f4a"
               */

              this.articles = loadMoreArticlesWeGot.articlesLoadMoreFromServer.map(
                  this.myArticleService.myMapBEArticlesToFEArticles
              );


              this.articlesToDisplay = this.articles; // whamma-jamma the current "LoadMore" # of them (e.g. 20, or 40, or 60 ...)

              this.articlesCountAllInCollection = loadMoreArticlesWeGot.maxArticlesFromServer;

              this.articlesCount = this.articlesToDisplay.length;

              this.offsetNumber = offsetNumberHere + this.offsetPageSize;

              this.articlesShownNumber = (
                  ( this.offsetNumber - this.offsetPageSize )
                  <=
                  this.articlesCountAllInCollection
              )
                  ? (this.offsetNumber - this.offsetPageSize)
                  : this.articlesCountAllInCollection;
              /* Two things fixed here.
              1. Just to get correct "1-20", "1-40" etc.
              - Kinda dumb have to subtract our hard-coded 20
               back off of 'offsetNumber' (because offsetNumber
               has by now been incremented) o well it works.
              2. The incrementing 20, 40...80, 100, 120 was sailing
              past the Max Number in the Collection (e.g. 98).
              So, with this "ternary" ? : we test for which
              of these expressions above is
              smaller, and show that.
               */

              if (this.articlesShownNumber === this.articlesCountAllInCollection) {
                this.loadNoMore = true;
              }
              /* Final bit of business (above)
              (Couldn't get into the terse ternary above)
              Disable that Load More button, if we've
              loaded ALL the Articles from the Collection.
              cheers.
               */


              if (this.filterIsOn) {
                // re-apply filter to new "load more" of articles
                this.letUsFilterByCategory(this.filterCategory);
              } else {
                // all set. we're on "All Categories" - no filtering needed
              }

            }
        ) // /.subscribe()
  } // /getArticlesLoadMore()


  letUsFilterByCategory (categoryStoredValuePassedIn: string): void {
    /* :void
    Doesn't return anything. Just sets variables for use in display.
     */
    // Hmm. Is it "StoredValue" ? ('arts') << No it ain't. (How tum called "Stored"? Hmm.)
    // I think it's viewValue ('Arts') << YEAH!
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (categoryStoredValuePassedIn === 'ALL') {
      /*  *************
      01 - USER CLICK ON THE 'ALL' BUTTON
          *************
       */
      this.filterIsOn = false;
      this.filterCategory = ''; // ? should it be 'ALL Articles' ?

      this.articlesToDisplay = this.articles;
      this.articlesInCategoryWhichCategory = 'All Categories';
    } else if (categoryStoredValuePassedIn === 'No Category (thx Service!)') {
      /*  *************
      02 - USER CLICK ON THE 'NO CATEGORY' BUTTON
          *************
      */

      // << YES, actually passed in (from that user button click

      /* COMBO HERE
Looking to account for both:
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
const NO_CATEGORY         = 'No Category (thx Service!)'; // << Count 62 (right now)
const NO_CORRECT_CATEGORY = 'No Correct Category (thx Service!)'; // << Count 3 (right now)
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
Goal is to display both sets together: 65 count
That is, user click on "No Category Assigned" button
yields both No Category, and No Correct Category.
cheers.
 */
      this.filterIsOn = true; // somewhat odd filter, but, a filter.
      this.filterCategory = 'No Category (thx Service!)';

      let articlesNoCategorySpecialFilteredFromService: any[];
      articlesNoCategorySpecialFilteredFromService = this.myFilterSortService.mySpecialFilter(this.articles, 'articleCategory_name', categoryStoredValuePassedIn);
      /* e.g.
        No Category (thx Service!) // << YES, actually passed in (from that user button click)
        "5f3515d7dec9620d8d5fe63a"

        No Correct Category (thx Service!)
        // NO! Perhaps surprisingly, the U/I
        button click is NOT passing this string.
        No. But, triggered by the above string
        of "No C.", we, over in the FilterService
        HARD-CODE in to test ALSO for this
        string of "No Correct C."
        cheers.
        "5af83649f2fffa14c4a22cd7"
       */

      this.articlesToDisplay = articlesNoCategorySpecialFilteredFromService;

      this.articlesInCategoryWhichCategory = 'No Category Assigned'; // << To show on U/I
      // Accounts for both: No C., No Correct C.


    } else {
      /*  *************
      03 - USER CLICK ON ANY REGULAR CATEGORY BUTTON (e.g. Politics)
          *************
      */
      // A proper Category, from our approved list :)

      this.filterIsOn = true;
      this.filterCategory = categoryStoredValuePassedIn;

      let articlesFilteredFromService: any[];
      articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles, 'articleCategory_name', categoryStoredValuePassedIn);

      this.articlesToDisplay = articlesFilteredFromService;

      this.articlesInCategoryWhichCategory = categoryStoredValuePassedIn;

    }

    this.articlesCount = this.articlesToDisplay.length;

    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryStoredValuePassedIn;
    }

  } // /letUsFilterByCategory()

} // /ArticlesCategorizedComponent {}
