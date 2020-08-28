import { Component, OnInit, Input, Output, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/common'; // << No longer needed
// import {Observable} from "rxjs"; // << not needed here after all
/* CRAP
import { PageScrollService } from 'ngx-page-scroll-core';
*/

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
export class ArticleListComponent implements OnInit {

  articles: Article[]; // empty to begin
    articlesToDisplay: Article[]; // be that ALL, or FILTERED
  // articles: [Article]; // empty to begin
  /*
  Property '0' is missing in type 'Article[]' but required in type '[Article]'
   */
  // articles: []; // empty to begin
  // articles = []; // empty to begin

    latestArticleDate: Date;
    latestArticleAnchorId: string; // articles[articles.length - 1].articleId_name
    articlesCount: number;
    noArticlesInCategory = false; // init
    noArticlesInCategoryWhichCategory: string; // e.g. 'Arts' when there are 0 articles
    articlesInCategoryWhichCategory = 'All Articles'; // init  // string; // e.g. 'Politics' when there ARE articles

    // PAGINATION biz
    currentPageNumber: number; // 1-based...
    pageSize = 5;  // hard-coded for now
    // pageSize = 20; // hard-coded for now
    // pageSize = 50; // hard-coded for now
    HARD_CODED_SMALLER_NUMBER_OF_ALL_ARTICLES_IN_COLLECTION = 15; // vs. actual ca. 99
    paginationButtonsArray: number[]; // e.g. [1,2,3,4...15] simply
    paginationButtonsControlledArray: number[]; // e.g. [1,2,3,4...15] simply
    lastPaginationNumber: number;
    // RANGE_AROUND = 0; // << DISALLOWED! (on each side of currentPageNumber)
    // RANGE_AROUND = 1; // (on each side of currentPageNumber)
    RANGE_AROUND = 2; // (on each side of currentPageNumber)

    /* Hmm. Good idea? Not good idea?
        https://stackoverflow.com/questions/48450349/math-function-not-working-in-angular-4-html
        YES WORKS KINDA KOOKY KRAZY
    */
    MyJavaScriptMath = Math; // << ??


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
/*
      this.getArticles(); // << OLDER. ALL. pre-PAGINATION.
*/
      this.getArticlesPaginated(this.currentPageNumber, this.pageSize)
/* Too Early!
      this.generateArticlesPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);
      console.log('this.paginationButtonsArray ', this.paginationButtonsArray);
*/
      /*
      []  << :o(  articlesCount is undefined. Need to invoke this LATER, not right here
       */

  } // /ngOnInit()

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

    } // /getArticles()


    getArticlesPaginated(page, pagesize) {
        // NEWER: Service ALSO returns 'Observable<Object>', to which we .subscribe()
        // Notes below on how we TYPE what is returned. Veddy, veddy carefully.

        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.myArticleService.listArticlesPaginated(page, pagesize)
            .subscribe(
                (allArticlesWeGot: {
                     articlesPaginatedFromServer: [],
                     maxArticlesFromServer: number,
                 }
                 // allArticlesWeGot: any // << Yes.
/* Yes.
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
                    console.log('Paginated. allArticlesWeGot {} ', allArticlesWeGot);
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

                    this.articles = allArticlesWeGot.articlesPaginatedFromServer.map(
                        (eachPseudoArticleFromApi: {
                            _id: string,
                            articleTitle: string,
                            articleUrl: string,
                            articleCategory: string,
                        }) => {

                            let eachRealArticleToReturn: Article;

                            /* CATEGORY FIXER
      Go get 'viewValue' for the (stored) 'value'
      returned from the DB.
      e.g. 'u.s.' as value will return 'U.S.' as viewValue
       */
                            let categoryViewValueSuchAsItIsReturned: string;

                            categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(eachPseudoArticleFromApi.articleCategory);
                            /*
                            Returns 'viewValue' e.g. 'No Category "viewValue" (thx Service!)' --OR-- category viewValue
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
                    /* WAS:  (all Articles)
                                      this.articlesCount = this.articles.length;
                    */
                    // Need to re-run this inside letUsFilterByCategory() ...
                    /* WAS:
                                      this.articlesCount = this.articlesToDisplay.length;
                    */

                    this.generateArticlesPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);
                    console.log('this.paginationButtonsArray ', this.paginationButtonsArray);
                    /*

                     */
                    this.generateArticlesControlledPaginator(this.currentPageNumber, this.pageSize, this.articlesCount);

                } // /next(allArticlesWeGot)

                /* WAS:
                          ); // /listArticles.subscribe()
                */
            ); // /listArticlesPaginated.subscribe()
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    } // /getArticlesPaginated()



    generateArticlesControlledPaginator(currentPageNumber, pageSize, articlesCount) {
        /*
                this.paginationButtonsControlledArray = Array.from(
                    {length: ( (articlesCount % pageSize > 0) ? (articlesCount/pageSize + 1) : (articlesCount/pageSize) )},
                    (myValue, myKey) => { return (myKey + 1); }
                );
        */
        // const RANGE_AROUND = 2; // (on each side of currentPageNumber) // make more global
        /* Output
        This makes you an Array of numbers. It is "1-based" (vs. 0).
        But it is "Controlled" in following sense:

        RANGE_AROUND: 2 (on each side of CURRPAGE)

        CURRPAGE: 1 (first)
        So: First | Prev | *1*, 2, 3, ... | Next | Last
        (THREE numeric entries) 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 2 (second)
        So: First | Prev | 1, *2*, 3, 4, ... | Next | Last
        (FOUR numeric entries) 1 + 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 3 (1 + RANGE_AROUND)
        So: First | Prev | 1, 2, *3*, 4, 5, ... | Next | Last
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 1 ellipsis

        CURRPAGE: 4 (e.g. in middle somewhere; not within RANGE_AROUND of either end)
        So: First | Prev | ..., 2, 3, *4*, 5, 6, ... | Next | Last
        (will get ellipsis on BOTH ends: '...'  <---->  '...')
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 2 ellipses


        CURRPAGE: 19 (last)
        So: First | Prev | ..., 17, 18, *19* | Next | Last
        (THREE numeric entries) 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 18 (penultimate)
        So: First | Prev | ..., 16, 17, *18*, 19 | Next | Last
        (FOUR numeric entries) 1 + 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 17 (terzultimate) (lastPaginationNumber - RANGE_AROUND)
        So: First | Prev | ..., 15, 16, *17*, 18, 19 | Next | Last
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 1 ellipsis

        CURRPAGE: 16 (not within RANGE_AROUND of either end)
        So: First | Prev | ..., 14, 15, *16*, 17, 18, ... | Next | Last
        (will get ellipsis on BOTH ends: '...'  <---->  '...')
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 2 ellipses

         */

        const firstPaginationNumber = 1; // of course
        this.lastPaginationNumber = (articlesCount % pageSize > 0) ? (Math.floor(articlesCount / pageSize + 1)) : (articlesCount / pageSize);

        // if ( currentPageNumber === 9 ) { // << Initial testing hard-coded; now removed :o)
        /* Sorry guys. switch / case no good for my
            special overall crazy needs here.
            Maybe you could figure out how to make use of it. Not me. cheers.

                switch () {
                    case:
                }
        */
        if (currentPageNumber === firstPaginationNumber) {
            //  ***  FIRST  ***

            let specialRangeAroundForFirst: number;
            // HARD-WON Trial & Error Information!
            // For "first" - RANGE 2: - 1   RANGE 1: - 0

            switch (this.RANGE_AROUND) { // << Here, simpler, yes can use switch
                case 2: {
                    specialRangeAroundForFirst = 1;
                    break;
                }
                case 1: {
                    specialRangeAroundForFirst = 0;
                    break;
                }
                default: {
                    console.log('WRONG! this.RANGE_AROUND must be 2 or 1. Instead looks like it is: ', this.RANGE_AROUND);
                }
            } // /switch()

            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1)}, // e.g. 3, or 2
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND - specialRangeAroundForFirst))); // funny math here RANGE 2 - 1   RANGE 1 0

                    // return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND - 0 ))); // funny math here RANGE 2 - 1   RANGE 1 0

                }
            );
        } else if (currentPageNumber === firstPaginationNumber + 1) {                  //  ***  SECOND  ***

            let specialRangeAroundForSecond: number;
            // HARD-WON Trial & Error Information!
            // For "second" - RANGE 2: + 0   RANGE 1: + 1

            switch (this.RANGE_AROUND) {
                case 2: {
                    specialRangeAroundForSecond = 0;
                    break;
                }
                case 1: {
                    specialRangeAroundForSecond = 1;
                    break;
                }
                default: {
                    console.log('WRONG! this.RANGE_AROUND must be 2 or 1. Instead looks like it is: ', this.RANGE_AROUND);
                }
            } // /switch()

            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1 + 1)}, // e.g. 4, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + specialRangeAroundForSecond))); // funny math here too RANGE 2 0   RANGE 1 + 1

                    // return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here too RANGE 2 0   RANGE 1 + 1

                    }
            );

        /*  ***  *NOT* NEEDED  for  THIRD  *** (NOR TERZULTIMATE, fwiw)
            else if ( currentPageNumber === firstPaginationNumber + 1 + 1) {
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1 + 1 + 1)}, // e.g. 5
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here too
                }
            );
        }*/

        } else if ( currentPageNumber === this.lastPaginationNumber - 1) {
            // *** PENULTIMATE ***
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1 + 1)}, // e.g. 4, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here  RANGE 2 +1   RANGE 1 +1
                }
            );
        } else if ( currentPageNumber === this.lastPaginationNumber) {
            //  ***  ULTIMATE. LAST  ***
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1)}, // e.g. 3, or 2
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here  RANGE 2 +1   RANGE 1 +1
                    /*
                    Q. Hmm, how come here at end (ULTIMATE, PENULTIMATE),
                    the number to add to RANGE_AROUND works
                    when consistently +1 ?

                    Whereas at the beginning (FIRST, SECOND) I had to
                    fuss with -1, 0, and +1 ?

                    And, the above is true for the two possible supported
                    RANGE_AROUND values, of both 2 (default), and 1.
                    Hmm.

                   A. I dunno. (sheepish grin)
                   Must be something about Beginning is hovering dangerously
                   near 0 and -1 (tsk, tsk) - needs special care.
                   While Ending is just out there at some big number
                    (94, whatever) - needs less "special" care. (I guess?)
                     cheers.
                     */
                }
            );
        }  else { //  ***  ALL OTHERS, "IN MIDDLE"  ***
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND * 2) + 1)}, // e.g. 5, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1)));
                }
            ); // [1,2,3,4,5] ADD (currentPageNumber - (RANGE_AROUND + 1)) => [7,8,9,10,11]

            /* Hmm. Good idea? Not good idea?
            MyJavaScriptMath = Math;
            https://stackoverflow.com/questions/48450349/math-function-not-working-in-angular-4-html
            YES (above) WORKS KINDA KOOKY KRAZY

            Or, pipes:
            https://stackoverflow.com/questions/41027749/angular-2-how-round-calculated-number
             */
            // So, right now, not using this "lastPaginationNumber" but can't hurt to create it. cheers.
            // ACTUALLY, I *am* making (different) use of it. so keep on. cheers.
            // (moved it up above just a bit)
            /* YES (see above)
                        this.lastPaginationNumber = (articlesCount % pageSize > 0) ? (Math.floor(articlesCount/pageSize + 1)) : (articlesCount/pageSize);
            */
            // } // /if ( currentPageNumber === 9 )
        }

    } // /generateArticlesControlledPaginator()


    generateArticlesPaginator(currentPageNumber, pageSize, articlesCount) {
      this.paginationButtonsArray = Array.from(
          {length: ( (articlesCount % pageSize > 0) ? (articlesCount/pageSize + 1) : (articlesCount/pageSize) )},
/* MODULO BIZ above
Somehow, with this Array.from() thing,
we get magic of automatic/built-in "rounding (down)" (h'rrah)
That is, I do NOT need to do Math.floor(). Okay. But compare in HTML template where I do.
cheers.

E.g. 99 articles, say, and pageSize of 5:
99/5 = 19.8, but that makes me just 19 buttons, 19 array elements. That's okay.

But to get that last needed 20th button, to display those final 4 articles
on that last screen, we do this modulo biz to correctly get that additional, 20th button.
cheers.
And yeah, when I deleted some 4 articles to get articlesCount down to 95 articles,
I then correctly get 19 buttons, no more - just right.
bueno.
      e.g. 99%5 > 0 ? (99/5 + 1) : 99/5
*/
          (myValue, myKey) => { return (myKey + 1); }
          );
      /* Output
      All this does is make you an Array of numbers. It is "1-based" (vs. 0).
      [1,2,3,4...15] // << Just consumed by our Paginator for rendering clickable buttons.
      That's it!
       */
      /* Magic:
      https://stackoverflow.com/questions/40528557/how-does-array-fromlength-5-v-i-i-work
      1. "Duck Typing" - Object with .length as a property (e.g. 15) is enough for JavaScript to
      believe it is an Array ("arrayLike"), and it makes you an empty Array, of that length (15)!
      Apparently, the Array has 15 indices (indexes): 0..14
      2. Arrow function. Hmm, takes 2 parameters, and the return is whamma-jamma-ed onto
      the "myValue". Hmm.
      Parameter 1 is the VALUE (** undefined **) found at/in each Array index (position).
      Parameter 2 is the KEY (gonna be 0..14) used/representing/pointer-to each Array index (position).

      // ***  ASIDE  ***
      Q. So - what (the hell) is the difference between an Array INDEX and an Array KEY ?
      A. Glad you asked. I am not sure I can explain. But, I have learned, here:
               https://www.dyn-web.com/javascript/arrays/associative.php
          about how JavaScript CAN have a KEY that is NOT a number, instead a string
          ("associative array"). I am not going to be using that, much.
          ----------------
          // numerically indexed array
var ar = ["apple", "orange", "pear", "banana"];
//  add element with string key
ar['fav'] = 'fig'; // <<<<<<<<<<<<<<<<<<< How you get the Weirdo!
alert( ar.length ); // 4
console.log (ar);

Array[4]
0: "apple"
1: "orange"
2: "pear"
3: "banana"
fav: "fig"  // <<<<<<<<<<<< Weirdo!
length: 4
          ----------------
       */
    } // /generateArticlesPaginator()


/* Finito with the slew
    loadAnotherLittleSlew() { // << Better name: "Load Another Little Slew"
      this.currentPageNumber++;
      this.getArticlesPaginated(this.currentPageNumber, this.pageSize);
    } // /loadMore()
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
