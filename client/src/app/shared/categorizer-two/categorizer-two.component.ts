// <!--  INITIAL SNAPSHOT COPY MADE 19/SEP/20. TODAY 22/SEP/20.  -->
// <!--  SECOND/FINAL SNAPSHOT COPY MADE 23/SEP/20. TODAY 23/SEP/20.  -->
import {Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';

import { ArticleService } from '../../articles/article.service';
import { FilterSortService } from '../../core/services/filter-sort.service';
import { Article, Category } from '../../articles/article.model';

@Component({
  selector: 'app-categorizer-two',
  templateUrl: './categorizer-two.component.html',
  styleUrls: ['./categorizer-two.component.scss']
})
export class CategorizerTwoComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Input('topOrBottomInputName')
  topOrBottomInput: string;

  @Input('articlesCountInputName')
  articlesCountInput: number; // in (the selected, filtered) Category

  @Input('offsetNumberInputName')
  offsetNumberInput: number; // values like 20, 40, 60...
  /* Note:
  fwiw, By time it gets here, this has been INCREMENTED (40, 60, 80...)
  over in Parent: ArticlesCategorizedComponent.getArticlesLoadMore()
  - Pro: the figure is ready for next click on Load More button = good
   */

  // NO LONGER  USED ( ??? )
  @Input('offsetPageSizeInputName')
  offsetPageSizeInput: number; // init in ParentComponent = 20; // HARD-CODED. Always 20 (yes?). Matches BE
  /*
  routes/api/api-articles.js:145
  const pageSize = 20; // hard-coded. 20 articles per "Load More" page.
   */

  /* What Is Going On Here. << WE ABANDONED THIS COMPLEXITY FRANK GOODNESS.
  1. We capture the INITIAL report from Parent Component on
  How Many Articles are in MongoDB Collection.
  2. We do subsequently UPDATE that (not-often-changing) figure,
  with each "Load More"
  Q. Why this bother?
  A. Because the timing for getting that UPDATED value was
  not in time to use for U/I logic here in Child Component,
  for disabling the "Load More" button. sigh.
   TURNS OUT WE DID NOT NEED THIS >> "INITIAL" << COMPLEXITY FRANK GOODNESS
NO>>  @Input('articlesCountAllInCollectionInitialInputName')
  articlesCountAllInCollectionInitialInput: number; // in entire MongoDB Collection
  */

  // re: above, this is all we need, right here:
  @Input('articlesCountAllInCollectionInputName')
  articlesCountAllInCollectionInput: number; // in entire MongoDB Collection


  @Input('articlesRetrievedNumberInputName')
  articlesRetrievedNumberInput: number;

  @Input('articlesInputName')
  articlesInput: Article[];

  @Input('noArticlesInCategoryInputName')
  noArticlesInCategoryInput: boolean;

  @Input('noArticlesInCategoryWhichCategoryInputName')
  noArticlesInCategoryWhichCategoryInput: boolean;


  @Input('articlesInCategoryWhichCategoryInputName')
  articlesInCategoryWhichCategoryInput: string;

  @Input('loadNoMoreInputName')
  loadNoMoreInput: boolean;

  @Output()
  categorizerGetArticlesLoadMoreEvent = new EventEmitter<{
    offsetNumberOutput: number,
    filterIsOnParam: boolean,
    filterCategory: string,
    loadNoMore: boolean, // ? Maybe name w. '__Output' ? t.b.d.
  }>();

  @Output()
  articlesToDisplayOutputEvent = new EventEmitter<{
    articlesToDisplayOutputArray: Article[],
    categoryViewValueOutput: string,
  }>();
  /* This is the "click on a Category button" event.
  Update: We use this to pass the category *name* to Parent
   */

  /* Superseded by @Input('articlesInputName') << ??
    articles: Article[]; //
  */

  /* Nah: NOT Superseded by @Output() articlesToDisplayOutputEvent ( ?? ) */
  articlesToDisplay: Article[];


  /* Superseded (je crois) by
  @Input('articlesCountAllInCollectionInputName')
  articlesCountAllInCollectionInput
  Vediamo.
   *************************** */
  articlesCountAllInCollection: number; // in entire MongoDB Collection


  filterIsOn = false; // init
  // filterCategory: string; // init ? ''; NO not up here.
  /* Had not been initializing till letUsFilter() etc.
  But now may need to from start.
  We'll do so in ngOnInit()  Better. */
  filterCategory: string; // 'All Categories'; // : string; // init ? '';

  /* ? should init value be 'ALL Articles'
  (or 'ALL Categories' for that matter) ?
  - Seems not necessary << Not sure yet, but am trying initialization 'All Categories' we'll see.
   */

  offsetNumberInCategorizer = this.offsetPageSizeInput; // init here. Also in ngOnInit(). CONSTANT as it were - 20. Has WRONG NAME.

  /*
  Superseded by @Input('loadNoMoreInputName'). Wotta world.
  We'll try a variation here.
  Assign the collected value via the "@Input(...InputName)"
  onto the plainly-named 'loadNoMore' for
  "Local" use, right here in the Component.
  What do you say. Clearer? Complicateder? hmm.

We'll do init:
 - in bottom of ngOnInit(), and, I don't know,
 - in ngAfterViewChecked(), in the method there:
   'updateDrawRedrawHereArticlesCategorizer()' ?
 We'll see.
   */
  loadNoMore: boolean; // << YES being used! // disable when max articlesRetrievedNumber

  categories: Category[];
  /* Initialize? or no?
    articlesInCategoryWhichCategory = 'All Categories'; // init  // string; // e.g. 'Politics' when there ARE articles
  */
  articlesInCategoryWhichCategory: string; // = 'All Categories'; // init  // string; // e.g. 'Politics' when there ARE articles

  /*  Superseded by @Input('noArticlesInCategoryInputName')
  re: noArticlesInCategory
  This too needs to be updated from Parent.
  Use Case: Load page. Click 'Business' (against initial 20)
  Get "No articles... add one..."
  Click Load More (40). Again, (60). NOW we DO find a Business.
  Need to hear about it down here in Child, to be able to turn off
  this "No articles... add one..." message.
   */
  noArticlesInCategory = false; // init
  noArticlesInCategoryWhichCategory: string;
  // e.g. 'Arts' when there are 0 articles in Arts

  myUIIsLoadingStore$: Observable<boolean>;

  constructor(
      private myArticleService: ArticleService,
      private myFilterSortService: FilterSortService,
      private myStore: Store,
      private myChangeDetectorRef: ChangeDetectorRef, // << Will I use? hmm. SEEMS NOPE. good. << YES! we DO use it. sheesh.
  ) { }

  ngOnInit(): void {

    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

    this.categories = this.myArticleService.getCategoriesInService();

    this.filterCategory = ''; // = 'All Categories'; // hmm ? // '' empty string ? seems to be best initialize here now


    this.offsetNumberInCategorizer = this.offsetPageSizeInput;
    /* // be sure to re-initialize, here. bueno.
    Hah. you don't want 0;
    N.B. MongoDB limit(0) is same as NO limit. o la!
     */
    console.log('CTGZ-01 - ngOnInit() this.offsetPageSizeInput ', this.offsetPageSizeInput); // Yes. 20
    console.log('CTGZ-02 - ngOnInit() this.offsetNumberInCategorizer ', this.offsetNumberInCategorizer); // Yes. 20

    /* TOO EARLY. We don't yet have articlesInput apparently. Hmm.
    ??
        console.log('CTGZ-02222A - ngOnInit() this.articlesInput ', this.articlesInput); // Yes. [] of {}
        console.log('CTGZ-02222B - ngOnInit() this.articlesInput[0].articleTitle_name ', this.articlesInput[0].articleTitle_name); // undefined :o(
        console.log('CTGZ-02222C - ngOnInit() this.articlesInput[0].articleCategory_name ', this.articlesInput[0].articleCategory_name); // undefined :o(
    */

    /* No Longer run method, from here.
       Now EventEmitter; causes listening parent Component to run method, over there.

        this.getArticlesLoadMore(this.offsetNumberInCategorizer); // init with offsetNumber of 0. (Get first twenty --> 0-19)
    */

    /* TEMP. Maybe do NOT call this upon initializing <app-categorizer>, hey ?
        this.emitCallGetArticlesLoadMore(this.offsetNumberInCategorizer);
    */
    // init with offsetNumber of 20. (Get first twenty --> 0-19) (yes, init w. 20. not 0)

    this.loadNoMore = this.loadNoMoreInput;
    /* ?
We'll do init:
 - in bottom of ngOnInit(), and, I don't know,
 - in ngAfterViewChecked(), in the method there:
   'updateDrawRedrawHereArticlesCategorizer()' ?
 We'll see.
 */

  } // /ngOnInit()

  ngAfterViewInit() {
    // what might I do in here ( ? <)
    // Seems next line is NOT needed. Hmm. t.b.d.
    // TODO ? this.emitCallGetArticlesLoadMore(this.offsetNumberInCategorizer);
  } // /ngAfterViewInit()

  ngAfterViewChecked() {

    console.log('0006 ngAfterViewChecked() this.articlesInCategoryWhichCategoryInput ', this.articlesInCategoryWhichCategoryInput);

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    this.updateDrawRedrawHereArticlesCategorizer(
        this.offsetNumberInput, // ? right number?
        // this.offsetNumberInCategorizer, // ? right number? // << NO !!! A very wrongly-named variable. yuk.
        this.articlesCountInput,  // ? right number?
        this.articlesCountAllInCollectionInput, // << YES
        this.articlesRetrievedNumberInput,   // ? right number?
        this.articlesInCategoryWhichCategoryInput,
        this.noArticlesInCategoryWhichCategoryInput,
        this.loadNoMoreInput,
    )
    /* Hmm - not quite all aligned. Hmm.  // ? right number?
      offsetNumberHere,
      articlesCountHere,
      articlesCountAllInCollectionHere,
      articlesRetrievedNumberHere,
      articlesInCategoryWhichCategoryHere,
     */
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    /* PAGINATOR NOTES: // << Note: Here in CATEGORIZER, I have **NOT** (yet?) seen this kind of error.
ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'NaN,NaN,NaN,NaN,NaN'. Current value: '1,2,3'.

Fix involves ChangeDetectorRef (see below).
Though we are not out of the woods.
 */
    /*
https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
 */
    this.myChangeDetectorRef.detectChanges(); // Will I use ? hmm.
    // OH YEAH BABY-KIN

  } // /ngAfterViewChecked()

  emitCallGetArticlesLoadMore(offsetNumberToEmit) {
    console.log('CTGZ-04 - emitCallGetArticlesLoadMore() offsetNumberToEmit ', offsetNumberToEmit); // Yes. 20.
    /* Hmm. needs to increment: 20, 40, 60...
    Yes. this is incrementing: 20, 40, 60
     */
    console.log('CTGZ-04B - emitCallGetArticlesLoadMore() this.filterIsOn ', this.filterIsOn); // Yes. e.g. true, false

    console.log('CTGZ-04C - emitCallGetArticlesLoadMore() this.filterCategory ', this.filterCategory); // Yes. e.g. 'U.S.' or 'No Category (thx Service!)'  Also will show: 'All Categories' (although the above boolean will be false)

    console.log('emitCallGetArticlesLoadMore 00 this.articlesCountAllInCollectionInput ', this.articlesCountAllInCollectionInput);
    console.log('emitCallGetArticlesLoadMore 00A this.offsetNumberInput ', this.offsetNumberInput);

    if (this.offsetNumberInput >= this.articlesCountAllInCollectionInput) {
      console.log('emitCallGetArticlesLoadMore 01 this.articlesCountAllInCollectionInput ', this.articlesCountAllInCollectionInput);
      // Yes. e.g. 102
      console.log('emitCallGetArticlesLoadMore 01A this.offsetNumberInput ', this.offsetNumberInput);
      // Yes. e.g. 120

      this.loadNoMore = true; // << Yes, set to true correctly. (But, OTHER Categorizer needs to hear about it!)
    } else {
      console.log('emitCallGetArticlesLoadMore 02 this.articlesCountAllInCollectionInput ', this.articlesCountAllInCollectionInput); // undefined
      console.log('emitCallGetArticlesLoadMore 02A this.offsetNumberInput ', this.offsetNumberInput); // yes. 40, 60 ...but goes above 100, 120, 140
    }
    /*  Disable the Load More button, if we've
    loaded ALL the Articles from the Collection.
    cheers.
     */


    // I moved the .emit() to AFTER the logic above, re: loadNoMore
    this.categorizerGetArticlesLoadMoreEvent.emit( {
          offsetNumberOutput: offsetNumberToEmit,
          filterIsOnParam: this.filterIsOn,
          filterCategory: this.filterCategory,
          loadNoMore: this.loadNoMore,
          /* Naming Convention notes:
          1) RHS - No '__Input' on 'this.loadNoMore' (y not; experiment)
          2) LHS - perhaps should do '__Output' on 'loadNoMore' i.e., 'loadNoMoreOutput' = t.b.d.
              btw, 'RHS' is "Right-Hand Side" ...
          */
        }
    );

  } // /emitCallGetArticlesLoadMore()


  emitArticlesToDisplayOutput(
      articlesToDisplayPassedIn: Article[],
      categoryViewValuePassedIn: string,
  ) {

    /*
    "articlesToDisplayPassedIn" will be our this.articlesToDisplay
    cheers.
    UPDATE: We are now getting a 2nd param to pass to Parent:
    category name.
     */

    this.articlesToDisplayOutputEvent.emit({
      articlesToDisplayOutputArray: articlesToDisplayPassedIn,
      categoryViewValueOutput: categoryViewValuePassedIn,
    });
  } // /emitArticlesToDisplayOutput()


  letUsFilterByCategory(categoryViewValuePassedIn: string): void {
    /*  :void  Doesn't return anything.
        Just sets values for use in display logic.

        UPDATE:
        Need this method to do two, not just one, job:
        - 1. (already doing) Filter by Category
        - 2. (new) Communicate Category choice up to Parent
        To accomplish that:
        - No additional parameter needed to be passed in here. No.
        - But, we need to pass another parameter on the .emit()
          at bottom of this long method.
          It is passing, currently: Article [ ]
          Needs to pass: Article [ ], category name
     */
    /*
        Values we get here: (ViewValues)
        e.g.
        1. Proper Category
        'U.S.',  or 'Opinion'

                -- OR --

        2. Category Missing or "Improper"
        Passed-in value is: 'No Category (thx Service!)'
N.B. That one value stands in for BOTH:
        'No Category (thx Service!)'
        'No Correct Category (thx Service!)'
        The "SpecialFilter" takes care of getting both,
        from the one query.
        cheers.

        -- OR --

        3. ALL Categories!
        Passed-in value is: 'ALL'

        The category string for U/I is 'All Categories'

         U.S.
      e.g.  "5f5d244e4deea82fc68aab86"

        No Category (thx Service!)
      e.g.  "5f3515d7dec9620d8d5fe63a"

        No Correct Category (thx Service!)
      e.g.  "5af83649f2fffa14c4a22cd7"

        All Categories
       e.g. "5f647f3b481d7d0b6f91c0a5"
     */

    this.noArticlesInCategoryInput = false; // reset
    this.noArticlesInCategoryWhichCategory = ''; // reset

    if (categoryViewValuePassedIn === 'ALL') {
      /*  *************
          01 - USER CLICK ON THE 'ALL' BUTTON
          *************
          N.B. string 'ALL' is hard-coded on that button
      */

      this.filterIsOn = false;
      this.filterCategory = 'All Categories'; // '';  // ? should it be 'ALL Articles' 'All Categories' ? Seemingly not necessary

      // this.articlesToDisplay = this.articles; // << Nope
      this.articlesToDisplay = this.articlesInput;
      console.log('CTGZ-05 letUsFilter() this.articlesToDisplay ', this.articlesToDisplay);
      console.log('CTGZ-06 letUsFilter() this.articlesToDisplay[0].articleCategory_name ', this.articlesToDisplay[0].articleCategory_name);
      console.log('CTGZ-07 letUsFilter() this.articlesToDisplay[0].articleTitle_name ', this.articlesToDisplay[0].articleTitle_name);
      /* Whoa. this is finally working
articleCategory_name: "Politics"
articleId_name: "5f647f3b481d7d0b6f91c0a5"
articleTitle_name: "For Trump, It’s Not the United States, It’s Red and Blue States"
articleUrl_name: "https://www.nytimes.com/2020/09/17/us/politics/trump-america.html"
       */

      this.articlesInCategoryWhichCategoryInput = 'All Categories';
      this.filterCategory = 'All Categories';
      /*
      TODO something redundantly being repeated and done twice here. don't know what it is; need to find out what it is I tell you.
       */

    } else if (categoryViewValuePassedIn === 'No Category (thx Service!)') {
      /*  *************
      02 - USER CLICK ON THE 'NO CATEGORY' BUTTON
          *************
          N.B. 1) string 'No Category (thx Service!)' is hard-coded on that button
          2) but the INTENT here is we use that trigger, to
          now go find BOTH
          - No Category (thx Service!)
          AND
          - No Correct Category (thx Service!)
          That is, user click on "No Category Assigned" button
yields both No Category, and No Correct Category.
cheers.
          See mySpecialFilter()
      */



      this.filterIsOn = true;
      this.filterCategory = 'No Category (thx Service!)';

      let articlesNoCategorySpecialFilteredFromService: Article[];
      articlesNoCategorySpecialFilteredFromService = this.myFilterSortService.mySpecialFilter(
          this.articlesInput,
          'articleCategory_name',
          categoryViewValuePassedIn,
      );
      /* e.g. the 3rd parameter categoryViewValuePassedIn
      is going to be:  'No Category (thx Service!)'
        That's what is actually passed in (from that user button click)

        Then, triggered by the above string
        of 'No Category (thx Service!)', we,
        over in the FilterService
        HARD-CODE in to test ALSO for this
        string of 'No Correct Category (thx Service!)'
        cheers.
       */

      this.articlesToDisplay = articlesNoCategorySpecialFilteredFromService;

      console.log('CTGZ-05b letUsFilter() this.articlesToDisplay ', this.articlesToDisplay);
      console.log('CTGZ-06b letUsFilter() this.articlesToDisplay[0].articleCategory_name ', this.articlesToDisplay[0].articleCategory_name);
      console.log('CTGZ-07b letUsFilter() this.articlesToDisplay[0].articleTitle_name ', this.articlesToDisplay[0].articleTitle_name);

      this.articlesInCategoryWhichCategoryInput = 'No Category Assigned';  // << To show on U/I
      // Accounts for both: No C., No Correct C.

    } else {
      /*  *************
      03 - USER CLICK ON ANY REGULAR CATEGORY BUTTON (e.g. Politics)
          *************
      */
      // A proper Category, from our approved list :)

      this.filterIsOn = true;
      this.filterCategory = categoryViewValuePassedIn;

      let articlesFilteredFromService: Article[];
      articlesFilteredFromService = this.myFilterSortService.myFilter(
          this.articlesInput,
          'articleCategory_name',
          categoryViewValuePassedIn,
      );

      this.articlesToDisplay = articlesFilteredFromService;

      this.articlesInCategoryWhichCategoryInput = categoryViewValuePassedIn;

    } // /# 03 Proper Category

    this.articlesCountInput = this.articlesToDisplay.length;
    console.log('CTGZ-03 - letUsFilterByCategory() this.articlesCountInput ', this.articlesCountInput); // Yes.  e.g. 3, 25, 0 etc.

    if (this.articlesCountInput === 0) {
      // No articles under, e.g. 'Arts' (sigh)
      this.noArticlesInCategoryInput = true;
      this.noArticlesInCategoryWhichCategory = categoryViewValuePassedIn;
    } else {
      // OK - There's at least ONE Article in this Category!
      console.log('CTGZ-05c letUsFilter() this.articlesToDisplay ', this.articlesToDisplay);
      console.log('CTGZ-06c letUsFilter() this.articlesToDisplay[0].articleCategory_name ', this.articlesToDisplay[0].articleCategory_name);
      console.log('CTGZ-07c letUsFilter() this.articlesToDisplay[0].articleTitle_name ', this.articlesToDisplay[0].articleTitle_name);
    }

    /*
    LAST THING WE DO HERE -
    Having used above logic to filter
    and arrive at 'articlesToDisplay',
    we invoke method that invokes the .emit() of that array,
    which passes it up to the Parent ArticlesCategorized.
     */
    /*
    Update. Need to ALSO pass up the Category (string, name)
     */

    /* No. Failing for 'ALL'. Don't use the passed-in param of categoryViewValuePassedIn. Nope.

    this.emitArticlesToDisplayOutput(this.articlesToDisplay, categoryViewValuePassedIn);
*/
    this.emitArticlesToDisplayOutput(this.articlesToDisplay, this.articlesInCategoryWhichCategoryInput);

  } // /letUsFilterByCategory(): void

  updateDrawRedrawHereArticlesCategorizer( // << Called from ngAfterViewChecked()
      offsetNumberHere,
      articlesCountHere,
      articlesCountAllInCollectionHere,
      articlesRetrievedNumberHere,
      articlesInCategoryWhichCategoryHere,
      noArticlesInCategoryWhichCategoryHere,
      loadNoMoreHere,
  ) {
    // cf. Paginator's updateRedrawHereArticlesControlledPaginator()

    /*
    Hmm, unlike Paginator, there is not a lot (any?) of
    logic in the TypeScript, to "draw/Redraw" the buttons.
    Just an *ngFor on the list of Categories.
    Only bit is: Which (if any) is CURRENTLY SELECTED Category?

    We do also track a few counters:
    - updateArticlesCount (# in Currently Selected Category)
    - updateOffsetNumber (# incrementer) 40, 60...
    - updateArticlesRetrievedNumber (duplicates sort of # incrementer; t.b.d. resolution...)
    - updateArticlesCountAllInCollection (# ALL/TOTAL in MongoDB Collection)

SO - from above two points:
- Maybe I just need to be passing down same way the CATEGORY string:
Hmm, either (maybe both ? nah)
-- this.articlesInCategoryWhichCategory = categoryViewValuePassedIn;
-- this.filterCategory = categoryViewValuePassedIn;

Maybe this? Parent HTML:
            bind-articlesInCategoryWhichCategoryInputName="updateArticlesInCategoryWhichCategory"

After That:
- 1. Why is Load More not working to get "other" Categorizer to know about new additional 20 ...
- 2. Why is initial rendering missing data on "Bottom" Categorizer. hmm.
- 3. Other bugs, doubtless.
     */

    /* GOOD.  Looks like I had it WRONG, putting ".update" on all these.
    Here is hoping.  See below instead.

          this.updateOffsetNumber = offsetNumberHere;
          this.updateArticlesCount = articlesCountHere;
          this.updateArticlesCountAllInCollection = articlesCountAllInCollectionHere;
          this.updateArticlesRetrievedNumber = articlesRetrievedNumberHere;
          this.updateArticlesInCategoryWhichCategory = articlesInCategoryWhichCategoryHere;
    */

    console.log('0008 updateDrawRedrawHereArticlesCategorizer() articlesInCategoryWhichCategoryHere << Passed-In ', articlesInCategoryWhichCategoryHere);

    this.offsetNumberInput = offsetNumberHere;
    this.articlesCountInput = articlesCountHere;
    this.articlesCountAllInCollectionInput = articlesCountAllInCollectionHere;
    this.articlesRetrievedNumberInput = articlesRetrievedNumberHere;
    this.articlesInCategoryWhichCategoryInput = articlesInCategoryWhichCategoryHere;
    this.filterCategory = articlesInCategoryWhichCategoryHere; // << Q. BUG FIX I HOPE ( ! )? A. YEAH!
    this.noArticlesInCategoryWhichCategoryInput = noArticlesInCategoryWhichCategoryHere;
    this.loadNoMore = loadNoMoreHere; // << N.B. *NO* "...Input" naming convention.

    /*
    One more bit of business: filterIsOn: boolean
    "Sibling" CategorizerComponent was ignorant of this flag, set by other sib.
    We test for "All Categories" - meaning no, filter is not on.
    Any other value ('Politics' or 'No Category (thx Service!)') means we ARE filtering.
    This flag is used upon clicking "Load More", to tell/flag the Parent
    Component to not only load more entries, but to ALSO (re-)apply the Filter.
    cheers.
     */
    console.log('0008A updateDrawRedrawHereArticlesCategorizer() this.articlesInCategoryWhichCategoryInput ', this.articlesInCategoryWhichCategoryInput);

    console.log('0009 update() articlesInCategoryWhichCategoryHere ', articlesInCategoryWhichCategoryHere); // 'ALL'
    /* Shee-it
    'ALL' not 'All Categories' wtf

    Till you CLICK 'All Categories' button. THEN you get: 'All Categories'. hmmph.
     */

    if (articlesInCategoryWhichCategoryHere !== 'All Categories')  {
      this.filterIsOn = true;
      console.log('00010 update() NOT All Categories? articlesInCategoryWhichCategoryHere ', articlesInCategoryWhichCategoryHere);
    } else {
      console.log('00011 update() All Categories? articlesInCategoryWhichCategoryHere ', articlesInCategoryWhichCategoryHere);
    }

  } // /updateDrawRedrawHereArticlesCategorizer()


  getArticlesLoadMore(offsetNumberHere: number): void {
// NO LONGER CALLED ***********
    this.myArticleService.listArticlesLoadMore(this.offsetPageSizeInput).subscribe(
        (loadMoreArticlesWeGot: {
          articlesLoadMoreFromServer: any[],
          maxArticlesFromServer: number,
        }) => {
          this.articlesInput = loadMoreArticlesWeGot.articlesLoadMoreFromServer.map(
              this.myArticleService.myMapBEArticlesToFEArticles
          );
          this.articlesToDisplay = this.articlesInput; // whamma-jamma
          // current "LoadMore" # of Articles (e.g. 20, 40, 60...)

          this.articlesCountAllInCollectionInput = loadMoreArticlesWeGot.maxArticlesFromServer;
          // this.articlesCountAllInCollection = loadMoreArticlesWeGot.maxArticlesFromServer;

          this.articlesCountInput = this.articlesToDisplay.length;

          this.offsetNumberInCategorizer = offsetNumberHere + this.offsetPageSizeInput;

          this.articlesRetrievedNumberInput = (
              ( this.offsetNumberInCategorizer - this.offsetPageSizeInput )
              <= // less-than-or-equal
              this.articlesCountAllInCollectionInput
          )
              ? (this.offsetNumberInCategorizer - this.offsetPageSizeInput)
              : this.articlesCountAllInCollectionInput;
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

          if (this.articlesRetrievedNumberInput === this.articlesCountAllInCollectionInput) {
            this.loadNoMore = true;
          }
          /* (Almost) final bit of business (above)
          (Couldn't get into the terse ternary above)
          Disable that Load More button, if we've
          loaded ALL the Articles from the Collection.
          cheers.
           */

          if (this.filterIsOn) {
            // re-apply filter to the new "load more"
            // now larger set of articles
            this.letUsFilterByCategory(this.filterCategory);
          } else {
            // No need. All set.
            // We must be on "All Categories" - no filtering needed
          }
          /*
          Final bit of business (above)
           */

        }
    ); // /.subscribe() SERVICE.listArticlesLoadMore()

  } // /getArticlesLoadMore() // NO LONGER CALLED ***********

} // /CategorizerTwoComponent {}
