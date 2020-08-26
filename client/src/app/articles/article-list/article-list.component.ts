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
    pageSize = 5; // hard-coded for now

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


                } // /next(allArticlesWeGot)

                /* WAS:
                          ); // /listArticles.subscribe()
                */
            ); // /listArticlesPaginated.subscribe()
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    } // /getArticlesPaginated()

    loadMore() { // << Better name: "Load Another Little Slew"
      this.currentPageNumber++;
      this.getArticlesPaginated(this.currentPageNumber, this.pageSize);
    } // /loadMore()

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
