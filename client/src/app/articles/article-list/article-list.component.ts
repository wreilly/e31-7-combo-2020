import { Component, OnInit } from '@angular/core';
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
            }
        );

  }

}
