import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import { Article, Category } from '../article.model';
import { ArticleService } from '../article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';

@Component({
    selector: 'app-articles-categorized-two',
    templateUrl: './articles-categorized-two.component.html',
    styleUrls: ['./articles-categorized-two.component.scss']
})
export class ArticlesCategorizedTwoComponent implements OnInit {

  categories: Category[];

  articles: Article[];
  articlesToDisplay: Article[]; // << Be that ALL, or Filtered

  articlesCountAllInCollection: number;
  updateArticlesCountAllInCollection: number;

  articlesCount: number; // in a Category
  updateArticlesCount: number;

  articlesInCategoryWhichCategory = 'All Categories'; // init  // string; // e.g. 'Politics' when there ARE articles
  updateArticlesInCategoryWhichCategory = 'All Categories'; // : string; // we don't init, do we? doubt it. << Mebbe we should.

  noArticlesInCategory = false; // << e.g. false, when there are 0 articles in Arts
  updateNoArticlesInCategory: boolean;

  noArticlesInCategoryWhichCategory: string; // << e.g. 'Arts' when there are 0 articles in Arts
  updateNoArticlesInCategoryWhichCategory: string;

  // LOAD MORE
  offsetPageSizeInParent = 20; // HARD-CODED.
  /*
  Matches Child CategorizerComponent. HARD-CODED.
  Matches BE. HARD-CODED.

  Child:
    src/app/shared/categorizer-two/categorizer-two.component.ts:36
    offsetPageSizeInCategorizer = 20; // HARD-CODED.

  BE:
    routes/api/api-articles.js:145
    const pageSize = 20; // HARD-CODED. 20 articles per "Load More" page.
   */
  offsetNumber: number;
  updateOffsetNumber: number;

  loadNoMoreForChild: boolean;
  // << disable when offsetNumber is >= articlesAllInCollection.

  myUIIsLoadingStore$: Observable<boolean>;

  constructor(
      private myArticleService: ArticleService,
      private myFilterSortService: FilterSortService,
      private myStore: Store,
  ) { }

  ngOnInit(): void {

    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

    this.categories = this.myArticleService.getCategoriesInService();

    this.offsetNumber = this.offsetPageSizeInParent; // 20, not 0
    /* Initialize
       Don't want 0. MongoDB limit(0) is same as *NO* limit. o la!
     */

    this.getArticlesLoadMore(this.offsetNumber);

  } // /ngOnInit()

  getArticlesLoadMore(offsetNumberHere) {
    /*
    offsetNumberHere received here is being incremented: 20, 40, 60...
     */

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
              /* [] of {} = OK  count: 20 first time, then 40, 60, 80 ...
              "BE ARTICLES":
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

              if ( (this.offsetNumber) >= this.articlesCountAllInCollection) {
                this.loadNoMoreForChild = true;
              }
              /*
              Disable that Load More button, if we've
              loaded ALL the Articles from the Collection.
              cheers.
               */

              /*
               INCREMENT offSetNumber, by (hard-coded) pageSize.
               */
              this.offsetNumber = offsetNumberHere + this.offsetPageSizeInParent;

              /* This method can handle every possible Category value, including
                 *  'ALL' or 'All Categories'
                 *  (No need any longer to test "is there any filter on, or not?")
               */
              this.letUsFilterByCategory(this.articlesInCategoryWhichCategory);

              this.updateArticlesControlledCategorizer (
                  this.offsetNumber,
                  this.articlesCount,
                  this.articlesCountAllInCollection,
                  this.articlesInCategoryWhichCategory,
                  this.noArticlesInCategory,
                  this.noArticlesInCategoryWhichCategory,
                  this.loadNoMoreForChild,
              );

            } // /next() == ( inside .subscribe() )

        ) // /.subscribe()

  } // /getArticlesLoadMore()

  updateArticlesControlledCategorizer (
      offsetNumber,
      articlesCount,
      articlesCountAllInCollection,
      articlesInCategoryWhichCategoryHere,
      noArticlesInCategoryHere,
      noArticlesInCategoryWhichCategoryHere,
      loadNoMoreForChildHere,
  ) {

    this.updateOffsetNumber = offsetNumber;

    this.updateArticlesCount = articlesCount;

    this.updateArticlesCountAllInCollection = articlesCountAllInCollection;

    this.updateNoArticlesInCategory = this.noArticlesInCategory;

    this.updateArticlesInCategoryWhichCategory = articlesInCategoryWhichCategoryHere;

    this.updateNoArticlesInCategory = noArticlesInCategoryHere;

    this.updateNoArticlesInCategoryWhichCategory = noArticlesInCategoryWhichCategoryHere;

    this.loadNoMoreForChild = loadNoMoreForChildHere;
    // N.B. Naming convention with *no* 'update___' (y not) (works fine)

  } // /updateArticlesControlledCategorizer()


  assignCategoryViewValueFromCategorizer(
      categoryViewValueOutputPassedIn: string,
  ) {

    this.articlesInCategoryWhichCategory = categoryViewValueOutputPassedIn;

    this.letUsFilterByCategory(this.articlesInCategoryWhichCategory);
    /*
    Returns void
    Sets this.articlesToDisplay to desired filtered []. good.
    Sets this.articlesCount (length of that [])
    Sets the 2 "noArticles" properties as well (when count is 0)
     */

    this.updateArticlesControlledCategorizer(
        this.offsetNumber,
        this.articlesCount,
        this.articlesCountAllInCollection,
        this.articlesInCategoryWhichCategory,
        this.noArticlesInCategory,
        this.noArticlesInCategoryWhichCategory,
        this.loadNoMoreForChild,
    )
  } // /assignCategoryViewValueFromCategorizer()


  letUsFilterByCategory (categoryViewValuePassedIn: string): void {
    /* :void
    Doesn't return anything. Just sets variables for use in display.
     */
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (
        categoryViewValuePassedIn === 'ALL'
        ||
        categoryViewValuePassedIn === 'All Categories' // << Now need to test also for this U/I Display value we use. Bit hacky.
    ) {
      /*  *************
      01 - USER CLICK ON THE 'ALL' BUTTON
          *************
       */
      this.articlesToDisplay = this.articles;
      this.articlesInCategoryWhichCategory = 'All Categories';
    } else if (
        categoryViewValuePassedIn === 'No Category (thx Service!)'
        ||
        categoryViewValuePassedIn === 'No Category Assigned' // << NEED TO ALSO TEST FOR this U/I Display value we use. Bit hacky
    ) {
      /*  *************
      02 - USER CLICK ON THE 'NO CATEGORY' BUTTON
          *************
      */
      /* re: JavaScript '||' OR operator - SEE Notes @:
      src/app/core/services/filter-sort.service.ts:251
      Key Take-Away: "Need to do two *entire evaluation expressions*, and '||' those."
      https://addyosmani.com/blog/exploring-javascripts-logical-or-operator/
       */

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

      /* TEMPORARY ASSIGNMENT, for sending a correct, expected string value to the SpecialFilter
      This gets "re-set" below.
      Essentially, if the value passed in is that U/I Display value of
      'No Category Assigned', that value would fail on our SpecialFilter.

      Why fail?
      Because the SpecialFilter actually compares the string to actual data values
      in the Article[] "category" property. Our Articles may have NC or NCC, but they will *not* have NCA.
      NC: No Category (thx Service!)
      NCC: No Correct Category (thx Service!)
      NCA: No Category Assigned // << this is just a U/I Display string we sort of overload in hacky way o well.

      So we temporarily put on a value that does work on the SpecialFilter.
       */
      this.articlesInCategoryWhichCategory = 'No Category (thx Service!)';

      let articlesNoCategorySpecialFilteredFromService: any[];
      articlesNoCategorySpecialFilteredFromService = this.myFilterSortService.mySpecialFilter(this.articles, 'articleCategory_name', this.articlesInCategoryWhichCategory);

      /* Update. Bug (edge-ish case) Fix.
      WAS: 3rd param was: categoryViewValuePassedIn // << This works ok for Use Case # 3 below, but not here on Use Case # 2.
      FIX IS: 3rd param now is: this.filterCategory
      Q. Why?
      A. Because categoryViewValuePassedIn gets sort of manipulated to become
         a U/I Display string: "No Category Assigned"
         This is NO GOOD for subsequent data filtering, where the values
         expected are 'No Category (thx Service!)' etc.
         So we manipulate it back as it were to run the filter, in line above.
       */
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

      // PUT (BACK) THE U/I DISPLAY VALUE:  (this sort of overloading: not ideal)
      this.articlesInCategoryWhichCategory = 'No Category Assigned'; // << To show on U/I
      // Accounts for both: No C., No Correct C.


    } else {
      /*  *************
      03 - USER CLICK ON ANY REGULAR CATEGORY BUTTON (e.g. Politics)
          *************
      */
      // A proper Category, from our approved list :)

      this.articlesInCategoryWhichCategory = categoryViewValuePassedIn;

      let articlesFilteredFromService: any[];

      articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles, 'articleCategory_name', this.articlesInCategoryWhichCategory);

      this.articlesToDisplay = articlesFilteredFromService;

    }

    this.articlesCount = this.articlesToDisplay.length;

    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryViewValuePassedIn;
    }

  } // /letUsFilterByCategory()

} // /ArticlesCategorizedTwoComponent {}
