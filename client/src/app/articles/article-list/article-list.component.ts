import { Component, OnInit, Input, Output, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/common'; // << No longer needed
// import {Observable} from "rxjs"; // << not needed here after all
/* CRAP
import { PageScrollService } from 'ngx-page-scroll-core';
*/

import { Category, CategoriesFromEnumLikeClassInModel } from '../article.model';
import { ArticleAddComponent, MyCategoriesEnumLikeClass } from '../article-add/article-add.component'; // re: categories fixer. hmm.

import { ArticleService } from '../article.service';

import {Article} from "../article.model";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  articles: Article[]; // empty to begin
  // articles: [Article]; // empty to begin
  /*
  Property '0' is missing in type 'Article[]' but required in type '[Article]'
   */
  // articles: []; // empty to begin
  // articles = []; // empty to begin

    latestArticleDate: Date;
    latestArticleAnchorId: string; // articles[articles.length - 1].articleId_name
    articlesCount: number;

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

/* COMPLETE CRAP
      this.myPageScrollService.scroll({
          document: this.myDocument,
          scrollTarget: '#foobarmaybe'
      });
*/

    // TEST TIME!
/*
    this.articles = [ ...this.testArticles ];
    console.log('this.(test)Articles! ', this.articles);
*/

    // REAL TIME!
    // Service returns 'Observable<Object>', to which we .subscribe()
    this.myArticleService.listArticles()
        .subscribe(
            (allArticlesWeGot: []) => {
              // this.articles = allArticlesWeGot; // whamma-jamma? << No! << Well, mebbe? (I mean, I did in 2018.)
                /*
                BE-to-FE Converter
                BE naming convention: articleTitle
                FE naming convention: articleTitle_name

                (and don't forget the FE FORM naming convention:
                articleTitle_formControlName)
                 */
              this.articles = allArticlesWeGot.map(
                  (eachPseudoArticleFromApi: {
                      _id: string,
                      articleTitle: string,
                      articleUrl: string,
                      articleCategory: string,
                  }) => {

                      let eachRealArticleToReturn: Article;

                      /* CATEGORY FIXER << from ArticleAddComponent
Go get 'viewValue' for the 'value' returned from the DB.
e.g. 'u.s.' as value will return 'U.S.' as viewValue
 */
/* NAH NOPE
                      ArticleAddComponent.categories;
                      MyCategoriesEnumLikeClass.categories;
NEMMENO
                      CategoriesFromEnumLikeClassInModel.get
*/

                      const whatCategoriesFromService: Category[] = this.myArticleService.getCategoriesInService();
                      console.log('9999999 whatCategoriesFromService ', whatCategoriesFromService);
/*
[{…}, {…}, {…}, {…}, {…}, {…}, {…}]
0: {value: "world", viewValue: "World-ENUM-LIKE-IN-SERVICE"}
1: {value: "u.s.", viewValue: "U.S."}
 */

                      let categoryViewValueNoCategory: boolean;
                      // let categoryThatMatches: Category; // declared now as Class Member (have I got that right?)
                      this.categoryThatMatches = {
                        value: 'no value',
                        viewValue: 'no viewValue'
                      };
                      console.log('0099A this.categoryThatMatches ', this.categoryThatMatches);
                      /* yep
                     {value: "no value", viewValue: "no viewValue"}
                       */

                      this.categoryThatMatches = whatCategoriesFromService.find(
                          /* .find() "finding" !
                          https://www.w3schools.com/jsref/jsref_find.asp
                          "where the function returns a true value"
                           */
                          (eachCategoryPair: Category) => {
                              console.log('eachPseudoArticleFromApi.articleCategory ', eachPseudoArticleFromApi.articleCategory); // undefined :o(
                              console.log('eachCategoryPair.value ', eachCategoryPair.value); // yes u.s., world, etc.

                              console.log('typeof eachPseudoArticleFromApi.articleCategory ', typeof eachPseudoArticleFromApi.articleCategory); // Yeah! typeof eachPseudoArticleFromApi.articleCategory  undefined

                              // YES this if() WORKED
                              if (typeof eachPseudoArticleFromApi.articleCategory === "undefined") {
/* https://flaviocopes.com/how-to-check-undefined-property-javascript/
                              if (typeof car.color === 'undefined') {
                                     // color is undefined
                               }
*/
                                  /* YES this if() also WORKED
                              if (eachPseudoArticleFromApi.articleCategory === undefined) {
*/
                                  console.log('Do We Get Here?'); // yassa! 109 times. hmmph!
                                  // return 'no category!'; // << No
                                  // return {value: "no category value", viewValue: "no category viewValue"}; // << No
                                  // TODONE set a flag; use that below in another statement to assign "no category" to our categoryViewValue. cheers.
                                  categoryViewValueNoCategory = true;

/* NAH. EXPERIMENT. */
                                  if (eachCategoryPair.value === eachPseudoArticleFromApi.articleCategory) {
                                      // should not match; it's undefined
                                      console.log('444 SHOULD NOT GET HERE'); // << correct-a-mundo
                                  } else {
                                      console.log('555 OUGHTA GET HERE ALRIGHT'); // << yeppers
                                      /*
                                      OK bit of ".find()" finding:
                                      See also below
                                      // This LOOKS like the object to return I want, but (see above) I do NOT NEED to do this.
And in fact, this bit of code below is NOT REALLY what is getting returned by .find()
cheers.

That is, THIS is why the first value was always getting returned for these items with No Category:  { "business" "Business" }   cheers.
                                       */
                                  //     return {
                                  //         value: 'there was no category VALUE',
                                  //         viewValue: 'there is no category VIEWVALUE',
                                  //     };
                                  }

                                 // return true; // << ??

                              } else {
/* Apparently, "returning" off an Array.find() is NOT gonna work... << RIGHT YOU ARE. Read below. */
                                  console.log('888 there IS A CATEGORY');
                                  console.log('777 and it is: ', eachPseudoArticleFromApi.articleCategory); // e.g., u.s.
                                  if (eachCategoryPair.value === eachPseudoArticleFromApi.articleCategory) {
                                      console.log('666 and the match is on ', eachCategoryPair.value); // e.g., u.s.
                                      return true; // ? << YES! (whoa who knew)
                                      /*
                                      Hah. All ya gotta do (off Array.find()) is figure out when to holler "true!"
                                      .find() will return the array element you are on.

                                      No need (see my code below) to "construct" the "value" you think
                                      you are "returning". Nope.
                                       */
/* // This LOOKS like the object to return I want, but (see above) I do NOT NEED to do this.
And in fact, this bit of code below is NOT REALLY what is getting returned by .find()
cheers.
                                      return {
                                          value: eachPseudoArticleFromApi.articleCategory, // e.g. u.s.
                                          viewValue: eachCategoryPair.viewValue, // e.g., U.S.
                                      };
*/
                                  }
                              }
                          }
                      ); // /.find()

                      console.log('333 this.categoryThatMatches ', this.categoryThatMatches);
                      /*
                      Dang. how'd that happen
                      {value: "business", viewValue: "Business"}
                       */

                      if (categoryViewValueNoCategory) {
                          console.log('00 categoryViewValueNoCategory is true!'); // << Yes.
                          const NO_CATEGORY = 'no category (thx Boolean!)';

                          eachRealArticleToReturn = {
                              articleId_name: eachPseudoArticleFromApi._id,
                              articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                              articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                              articleCategory_name: NO_CATEGORY, // 'viewValue' e.g. 'no category!...' // << YES WORKS
                              // articleCategory_name: this.categoryThatMatches.viewValue, // 'viewValue' e.g. 'solly! no categolly!'
                          }
                      } else {
                          // There IS A CATEGORY by gum
                          eachRealArticleToReturn = {
                              articleId_name: eachPseudoArticleFromApi._id,
                              articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                              articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                              articleCategory_name: this.categoryThatMatches.viewValue, // 'viewValue' e.g. 'U.S.'
                          }
                      }
                    return eachRealArticleToReturn;
                  }
              ) // /allArticlesWeGot.map()

                this.latestArticleDate = this.myDateFromObjectId(this.articles[this.articles.length - 1].articleId_name);
                this.latestArticleAnchorId = this.articles[this.articles.length - 1].articleId_name;
                this.articlesCount = this.articles.length;

            } // /next(allArticlesWeGot)

        ); // /listArticles.subscribe()

  } // /ngOnInit()

    // https://steveridout.github.io/mongo-object-time/
    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };

}
