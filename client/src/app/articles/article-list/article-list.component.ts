import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../article.service';
// import {Observable} from "rxjs"; // << not needed here after all
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


  constructor(
      private myArticleService: ArticleService,
  ) { }

  ngOnInit(): void {

      // ***********
      if (history.state.data) {
          if (history.state.data.articleListOnArticlesListPage) {
              this.articleListOnArticlesListPage = true;
          }
      }

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
                  }) => {

                    let eachRealArticleToReturn: Article = {
                      articleId_name: eachPseudoArticleFromApi._id,
                      articleTitle_name: eachPseudoArticleFromApi.articleTitle,
                      articleUrl_name: eachPseudoArticleFromApi.articleUrl,
                    }

                    return eachRealArticleToReturn;
                  }
              )
                this.latestArticleDate = this.myDateFromObjectId(this.articles[this.articles.length - 1].articleId_name);
              this.latestArticleAnchorId = this.articles[this.articles.length - 1].articleId_name;
              this.articlesCount = this.articles.length;
            }
        );

  } // /ngOnInit()

    // https://steveridout.github.io/mongo-object-time/
    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };

}
