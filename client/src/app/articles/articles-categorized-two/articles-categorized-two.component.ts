// <!--  INITIAL SNAPSHOT COPY MADE 19/SEP/20. TODAY 22/SEP/20.  -->
// <!--  SECOND/FINAL SNAPSHOT COPY MADE 23/SEP/20. TODAY 23/SEP/20.  -->
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

  articles: Article[]; // empty to begin
  articlesToDisplay: Article[];
  // Be that ALL, or Filtered

  articlesCountAllInCollection: number;
  articlesCount: number; // in a Category
  articlesInCategoryWhichCategory = 'All Categories'; // init  // string; // e.g. 'Politics' when there ARE articles
  updateArticlesInCategoryWhichCategory = 'All Categories'; // : string; // we don't init, do we? doubt it. << Mebbe we should.
  updateNoArticlesInCategoryWhichCategory; // init ? ''

  filterIsOn = false; // init
  filterCategory: string; // init ? '';
  /* ? should init value be 'ALL Articles'
  (or 'ALL Categories' for that matter) ?
  - Seems not necessary
   */

  // LOAD MORE
  offsetPageSize = 20; // HARD-CODED. Matches BE
  /*
  routes/api/api-articles.js:145
  const pageSize = 20; // hard-coded. 20 articles per "Load More" page.
   */
  updateOffsetNumber: number; // << Variable. I hope this is right
  updateOffsetPageSize = this.offsetPageSize; // constant as it were - HARD-CODED 20. // : number;

  offsetNumber = this.offsetPageSize; // VARIABLE. Initialized here to 20, not 0; // init. Also (re-)initialized in ngOnInit()
  articlesRetrievedNumber: number;

  loadNoMoreForChild: boolean; // Need to init false?? << disable when max articlesRetrievedNumber
  /*
  - 'loadNoMoreForChild'
  Above new, for Parent Component, to simply store but not use
  this boolean. It is passed up from one Child,
  back down to the other.
  Also - (y not) - trying new variation in naming convention.
  NOT using the 'update___' prefix. we'll see...

  - 'loadNoMore'
  Below is now no-longer-used boolean for
  when this Parent itself had the "Categorizer" template,
  which we are in process of factoring out, to new Child Component.
   */
  loadNoMore: boolean; // << NO LONGER USING. disable when max articlesRetrievedNumber


  updateArticlesCount: number;
  updateArticlesCountAllInCollection: number;
  updateArticlesRetrievedNumber: number;

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

  updateNoArticlesInCategory: boolean; // init false ?
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

    this.offsetNumber = this.offsetPageSize; // 20, not 0
    /* // be sure to re-initialize, here. bueno.
    Hah. you don't want 0;
    N.B. MongoDB limit(0) is same as NO limit. o la!
     */

    // this.getArticles();
    this.getArticlesLoadMore(this.offsetNumber);
/* NO
    this.getArticlesLoadMore(this.offsetNumber, false, 'All Categories', this.loadNoMoreForChild);
*/
    /* init with offsetNumber of 20, not 0. (Get first twenty --> 0-19).
    Also, default 'ALL' category to begin. << ? 'All Categories'? --OR-- '' (empty)?
     */

  } // /ngOnInit()


/* ##################################
*  MIGRATION to -Two Version
##################################
* Can keep same name: getArticlesLoadMore()
* But, (Probably ?!?) No More sending up:
* - filterIsOnParam
* - filterCategory
* - loadNoMore
*/

  getArticlesLoadMore(offsetNumberHere) { // initially WAS: emitted << no longer used
/* No Longer these 4 params. Just 1.
  getArticlesLoadMore(offsetNumberHere, filterIsOnParam, filterCategoryParam, loadNoMoreParam) { // initially WAS: emitted << no longer used
*/
    /*
    offsetNumberHere is variable: 20, 40, 60...
     */
/* NO MORE
    console.log('0001 - getLoadMore filterCategoryParam: ', filterCategoryParam);
*/

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
              /* [] of {} = OK  count: 20 first time, then 40, 60, 80 ...
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

              /* INCREMENT offSetNumber
              N.B. I should be doing this near/at bottom
              of this method, rather than right here.
              Doing increment here, in following lines of logic,
              I need to (artificially) subtract it right back off!
              d'oh. TODO refactor/fix
               */
              this.offsetNumber = offsetNumberHere + this.offsetPageSize;
              /*
offsetNumberHere is variable: 20, 40, 60...
Incremented to 40, 60, 80...
 */

              this.articlesRetrievedNumber = (
                  ( this.offsetNumber - this.offsetPageSize )
                  <= // less-than-or-equal
                  this.articlesCountAllInCollection
              )
                  ? (this.offsetNumber - this.offsetPageSize)
                  : this.articlesCountAllInCollection;
              /* Two things fixed here in this ternary conditional expression:

              1. To get correct upper number in the
                 "1-20", "1-40", "1-60" etc.
              - Kinda dumb but have to subtract our hard-coded 20
               back off of 'offsetNumber' (because offsetNumber
               has by now been incremented) o well it works.

              2. The incrementing 20, 40...80, 100, 120, 140
              was sailing up past the
              Max Number in the Collection (e.g. 98).
              So, with this "ternary" ? : we test for which
              of these expressions above is
              smaller, and show that.
               */


              /* UPDATE UPDATE
              Change of mind. Now, YES we'll do this calculation in Parent.
               */
              /* ###################################
                 *  MIGRATION TO "-TWO" VERSION
                 * Do not do this if() test down in Child.
                 * Just pass the offsetNumber up here to Parent.
                 * Here in Parent we'll do this same if() test instead, and update loadNoMore as appropriate.
                 * cheers.
               */
/* Child had:
              if (this.offsetNumberInput >= this.articlesCountAllInCollectionInput) {
                this.loadNoMore = true;
*/
              /* UPDATE << SUPERSEDED. see above, below
              I think we should no longer (re-)calculate
              this boolean "loadNoMore-biz" in Parent.
              Just let Child-01 report it "up", and have
              Parent pass it back "down" to Child-02.
               */
/* MIGRATION TO "-TWO" VERSION
No longer using this param, from Child.

              this.loadNoMoreForChild = loadNoMoreParam; // << GOING AWAY // << from "Child-01"
*/
              /* UPDATE UPDATE. Yes, we're putting this BACK IN.    No Longer: (see Comment above) */
              if (this.articlesRetrievedNumber === this.articlesCountAllInCollection) {
                /* N.B. Child had: For consideration ...
                if (this.offsetNumberInput >= this.articlesCountAllInCollectionInput) {
                 */
                this.loadNoMoreForChild = true; // << very nice.
                /* This one param from parent will be bound down to both/all Categorizer components.
                   No need for "Child-01-to-Parent-to-Child-02" communication.
                 */
              }
              /* Final bit of business (above)
              (Couldn't get into the terse ternary above)
              Disable that Load More button, if we've
              loaded ALL the Articles from the Collection.
              cheers.
               */


/* ##################################
*  MIGRATION to -Two Version
   ##################################
* Here in getArticlesLoadMore() ...
* But, (Probably ?!?) No More using:
* - filterIsOnParam // << ? may not need. Can derive from this.articlesInCategoryWhichCategory
* - filterCategory // << We have here in Parent: this.articlesInCategoryWhichCategory
* - loadNoMore // << We have here in Parent: this.loadNoMoreForChild
*/
              /*  (older Comment)
Don't forget. (Guess I had.) (How did I miss this ??)
Update another possibly redundant value here re: currently selected Category:

e.g. 'U.S.' or 'No Category (thx Service!)'
Also will show: 'All Categories' (although the 'filterIsOn' boolean will be false)
 */
/* GOING AWAY.
              console.log('0002 - getLoadMore filterCategoryParam: ', filterCategoryParam); // << GOING AWAY
              console.log('0002A - getLoadMore filterIsOnParam: ', filterIsOnParam); // << GOING AWAY
*/
/* NO. Don't overwrite this Parent property, with what was passed up from Child.
              this.articlesInCategoryWhichCategory = filterCategoryParam; // << GOING AWAY
*/
              console.log('0003 - getLoadMore articlesInCategoryWhichCategory: ', this.articlesInCategoryWhichCategory);

              /* ##################################
               *  MIGRATION to -Two Version
                 ##################################
                 * Won't need this if() logic I believe.
                 * Am keeping the structure for this first pass.
                 * Will remove.
                 * Basically next line is simply:
                   this.letUsFilterByCategory(this.articlesInCategoryWhichCategory);
                 * Q. Why does that work?
                 * A. Because that method can handle 'ALL' or 'All Categories' just fine.
                 *    (No need to test "is there any filter on, or not?")
                 * MBU
               */
              if (true) { // we're just "going in!"
              // if (filterIsOnParam) { // << GOING AWAY
                // if (this.filterIsOn) {
                // re-apply filter to new "load more" of articles
                /* Worked fine, here within ArticlesCategorizedComponent

                                this.letUsFilterByCategory(this.filterCategory);

                CRAZY NOTE:
                We are considering sorta using 'COMPONENT_OVERRIDE' here. hmm. maybe not.
                but see it also in the HTML. bit of mixed bag
                going on here. be right back.
                */
                /* But now we're trying Child-to-Parent
                communicating from Categorizer...
                 */
/*
                this.letUsFilterByCategory(filterCategoryParam); // << GOING AWAY
*/
                this.letUsFilterByCategory(this.articlesInCategoryWhichCategory);

              } else { // << GOING AWAY
                // all set. we're on "All Categories" - no filtering needed
              }

              this.updateArticlesControlledCategorizer (
                  this.offsetNumber,
                  this.articlesCount,
                  this.articlesCountAllInCollection,
                  this.articlesRetrievedNumber,
                  this.articlesInCategoryWhichCategory, // << 'All Categories' initially
                  this.noArticlesInCategory,
                  this.noArticlesInCategoryWhichCategory,
                  this.loadNoMoreForChild,
              );
              /* 1st param:
WAS: this.offsetPageSize
IS NOW: this.offsetNumber  << I hope this is right
 */

            } // /next() == ( inside .subscribe() )

        ) // /.subscribe()
  } // /getArticlesLoadMore()

  updateArticlesControlledCategorizer (
      offsetNumber,
      articlesCount,
      articlesCountAllInCollection,
      articlesRetrievedNumber,
      articlesInCategoryWhichCategoryHere,
      noArticlesInCategoryHere,
      noArticlesInCategoryWhichCategoryHere,
      loadNoMoreForChildHere,
  ) {
    /* LATE-BREAKING FIX (hmm, t.b.d.)
    We need to send down Article[ ] on INITIAL getArticles()
     */
    /* 1st param:
    WAS: offsetPageSize
    IS NOW: offsetNumber  << I hope this is right
     */
    /*
            bind-articlesCountInputName="articlesCount" // << count in Category, within current RetrievedNumber
            bind-offsetPageSizeInputName="offsetPageSize" // << constant, really. 20.
            bind-articlesCountAllInCollectionInputName="articlesCountAllInCollection"
            bind-articlesRetrievedNumberInputName="articlesRetrievedNumber"
     */

    this.updateOffsetNumber = offsetNumber; // << I hope this is right
    /* No need to update. This (I think?) is a constant HARD-CODED 20.
        this.updateOffsetPageSize = offsetPageSize; // << No.
    */

    this.updateArticlesCount = articlesCount;
    this.updateArticlesCountAllInCollection = articlesCountAllInCollection;
    this.updateArticlesRetrievedNumber = articlesRetrievedNumber;

    this.updateNoArticlesInCategory = this.noArticlesInCategory;

    this.updateArticlesInCategoryWhichCategory = articlesInCategoryWhichCategoryHere;

    console.log('0005 update() this.articlesInCategoryWhichCategory ', this.updateArticlesInCategoryWhichCategory);

    this.updateNoArticlesInCategory = noArticlesInCategoryHere;

    this.updateNoArticlesInCategoryWhichCategory = noArticlesInCategoryWhichCategoryHere;

    this.loadNoMoreForChild = loadNoMoreForChildHere;
    // N.B. Trying naming convention with *NO* 'update___' (y not)

  } // /updateArticlesControlledCategorizer()


/*
  ##################################
  *  MIGRATION to -Two Version
  ##################################
  * Rename assignArticlesToDisplayFromCategorizer() to assignCategoryViewValueFromCategorizer()
  * No more Article[] << No.
*/
  assignCategoryViewValueFromCategorizer(
      categoryViewValueOutputPassedIn: string,
  ) {
    /*
    Update: We now use this to XXalsoXX *only* get the category name,
            up from the Child Categorizer component.
     */

    // These "resets" prob ought go further below, in "if()" logic re: count is 0 or not .... t.b.d.
    // prob can benignly stay right here ...
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

/*
    ##################################
    *  MIGRATION to -Two Version
    ##################################
    * REMOVE (No Longer Use) Article[]
    * No more this.articlesToDisplay update here
    * Instead of in the Child, here in the **Parent**,
    * we will do the Filtering on Category,
    * to get the "this.articlesToDisplay"
*/
    // NO MORE Article[]   console.log('assignArticlesToDisplayFromCategorizer articlesToDisplayOutputArrayPassedIn: ', articlesToDisplayOutputArrayPassedIn);
    // this.articlesToDisplay = articlesToDisplayOutputArrayPassedIn; // << GOING AWAY
    // this.articlesCount = this.articlesToDisplay.length; // << GOING AWAY
    /* ############################### */

    this.articlesInCategoryWhichCategory = categoryViewValueOutputPassedIn;

    /* ###  NEW : MIGRATION ###
     * Execute this method to "Filter" from here in Parent now.
     * (Filtering used to be done down on the Child, who used to pass up the resultant Article[]. No more.)
     */
    this.letUsFilterByCategory(this.articlesInCategoryWhichCategory);
    /*
    Returns void
    Sets this.articlesToDisplay to desired filtered []. good.
    Sets this.articlesCount (length of that [])
    Sets the 2 "noArticles" properties as well (when count is 0)
     */

    // ### THESE LINES ARE GOING AWAY. SUPERSEDED by letUsFilter()...
    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryViewValueOutputPassedIn;
    }

    /* OLDER NOTE:
    Note:
    - At first, when this method only received the Article[ ], there was no need to
    run the .update() method to communicate to other (Children)
    components. Could just locally, immediately, render those Articles. ok.
    - Then, with 2nd param of Category (string), we must run .update() to actually SEND OUT
    that new param data, in particular to the "Other" Child,
    namely the other CategorizerComponent (be it "Top" or "Bottom") that
    did NOT pass in this Category info. That "other" one needs
    to hear, from Parent, about what Category its sibling now is
    using - to be in sync.
    cheers.
     */
    console.log('0004 assignArticles...() about to update() this.articlesInCategoryWhichCategory ', this.articlesInCategoryWhichCategory);

    this.updateArticlesControlledCategorizer(
        // 4 (?) of 8 will be unchanged, but, we need that 5th and 6th and 7th and 8th (!)
        // << Have I got this right? << No! Ya VERY MUCH didn't!
        this.offsetNumber,
        this.articlesCount, // << needed updating (done)
        this.articlesCountAllInCollection,
        this.articlesRetrievedNumber,
        this.articlesInCategoryWhichCategory, // << we just got this :)
        this.noArticlesInCategory, // << needed updating (done)
        this.noArticlesInCategoryWhichCategory, // << needed updating (done)
        this.loadNoMoreForChild,
    )
  } // /assignArticlesToDisplayFromCategorizer()
  // renaming to: /assignCategoryViewValueFromCategorizer()


  letUsFilterByCategory (categoryViewValuePassedIn: string): void {
    /* :void
    Doesn't return anything. Just sets variables for use in display.
    In particular the this.articlesToDisplay
     */
    // Hmm. Is it "StoredValue" ? ('arts') << No it ain't. (How tum called "Stored"? Hmm.)
    // I think it's viewValue ('Arts') << YEAH!
    this.noArticlesInCategory = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (
        // categoryViewValuePassedIn === 'ALL' // << WAS JUST
        categoryViewValuePassedIn === 'ALL'
        ||
        categoryViewValuePassedIn === 'All Categories' // << Now need to test also for this U/I Display value we use. Bit hacky.
    ) {
      /*  *************
      01 - USER CLICK ON THE 'ALL' BUTTON
          *************
       */
      this.filterIsOn = false;
      this.filterCategory = ''; // ? should it be 'ALL Categories' ?

      this.articlesToDisplay = this.articles;
      this.articlesInCategoryWhichCategory = 'All Categories';
    } else if (
        // categoryViewValuePassedIn === 'No Category (thx Service!)' // << WAS JUST
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
      articlesNoCategorySpecialFilteredFromService = this.myFilterSortService.mySpecialFilter(this.articles, 'articleCategory_name', this.filterCategory);
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

      this.articlesInCategoryWhichCategory = 'No Category Assigned'; // << To show on U/I
      // Accounts for both: No C., No Correct C.


    } else {
      /*  *************
      03 - USER CLICK ON ANY REGULAR CATEGORY BUTTON (e.g. Politics)
          *************
      */
      // A proper Category, from our approved list :)

      this.filterIsOn = true;
      this.filterCategory = categoryViewValuePassedIn;

      let articlesFilteredFromService: any[];
      articlesFilteredFromService = this.myFilterSortService.myFilter(this.articles, 'articleCategory_name', categoryViewValuePassedIn);

      this.articlesToDisplay = articlesFilteredFromService;

      this.articlesInCategoryWhichCategory = categoryViewValuePassedIn;

    }

    this.articlesCount = this.articlesToDisplay.length;

    if (this.articlesCount === 0) {
      // No articles under, e.g., 'Arts' (sigh)
      this.noArticlesInCategory = true;
      this.noArticlesInCategoryWhichCategory = categoryViewValuePassedIn;
    }

  } // /letUsFilterByCategory()


  // ///////////////////////////////////
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


} // /ArticlesCategorizedTwoComponent {}
