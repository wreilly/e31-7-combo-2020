import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Article } from './article.model';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  articleMostRecentDisplayBE: {
    _id: string,
    articleTitle: string,
    articleUrl: string,
  };
  articleMostRecentDisplayFE: Article;

  constructor(
      private myArticleService: ArticleService,
  ) { }

  ngOnInit(): void {
    this.getArticleMostRecent(); // fine for FIRST time ...
  }

/*
  ngAfterViewInit() {
    console.log('AFTER VIEW Kids 01 & this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
    if (!this.articleMostRecentDisplayFE) {
      console.log('AFTER VIEW Kids 02');
      this.getArticleMostRecent(); // ?? NO. does not run "navigating" back to /articles ?
    }
  }
*/

/*
  ngOnChanges() {
    /!* Hmm
        N.B.  "ngOnChanges() is called when any data-bound property of a directive changes"
           https://angular.io/api/core/OnChanges
     *!/
    console.log('ON CHANGES Kids 01 & this.articleMostRecentDisplayFE ', this.articleMostRecentDisplayFE);
    if (!this.articleMostRecentDisplayFE) {
      console.log('ON CHANGES Kids 02');
      this.getArticleMostRecent(); // ?? NO. nothin' !! ??
    }
  }
*/

  hideArticleMostRecent() {
    // HACK-Y!
    this.articleMostRecentDisplayFE = null;
  }

  getArticleMostRecent() {
    this.myArticleService.getArticleMostRecent()
        .subscribe(
            (whatIGot:{
              _id: string,
              articleTitle: string,
              articleUrl: string,
            }) => {
              console.log('ARTICLES. Most Recent. whatIGot BE ', whatIGot);

              this.articleMostRecentDisplayBE = whatIGot; // << whamma-jamma for BE flavor
              console.log('fwiw, this.articleMostRecentDisplayBE ', this.articleMostRecentDisplayBE);
              /*
              ARRAY of one - same as above.
               */

              /* =====================================
                 TIME TO "CONVERT" TO THE "FE NAMING CONVENTION" for an Article
                 =====================================
              */
              // 04  ** YES **  Object Literal Initializer << whoa
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
              // N.B. 1st item off ARRAY[0] <<
              this.articleMostRecentDisplayFE = {
                articleId_name: whatIGot[0]._id,
                articleTitle_name: whatIGot[0].articleTitle,
                articleUrl_name: whatIGot[0].articleUrl
              };
              console.log('*MUCH* MORE BETTER fwiw, this.articleMostRecentDisplayFE $$$ :o) ', this.articleMostRecentDisplayFE);
              /* "FE NAMING CONVENTION" = bueno
              This is officially of 'Type' 'Article' - good.
Hmm:
{articleId_name: undefined
articleTitle_name: undefined
articleUrl_name: undefined}
               */

            }
        );
  } // getArticleMostRecent()


}
