import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
import {Observable} from "rxjs"; // << ?? t.b.d.

@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

    // DOT.NEXT() (not "DOT.PIPE()"/ASYNC)
    articleAsOneItemArrayHereInDetailPage: any[] = [];

    articleAsObservableHereInDetailPage$: Observable<any[]>;
    // articleAsObservableHereInDetailPage$: Observable<Object>;

    articleHereInDetailPage;

    articleHereInDetailPageAttempt01: Article = {
        articleId_name: null,
        articleTitle_name: 'title placeholder',
        articleUrl_name: 'url placeholder',
    };

    constructor(
        private myArticleService: ArticleService,
        private myActivatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.getArticle();
    }

    getArticle() {
        console.log('getArticle 1111!');
        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                console.log('getArticle 222!');
                const articleIdHereInDetailPage = paramsIGot['article_id'];
                /* ^^
                That 'article_id' param name is
                 determined in the (Article) Routing Module
                 */


                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: any) => {
                            console.log('getArticle 3333!');
                            console.log('9999 getArticle. articleIGot: ', articleIGot);

                            this.articleHereInDetailPage = articleIGot; // BOOM.
                            this.articleAsOneItemArrayHereInDetailPage.push( articleIGot);
                        }
                    );


/* NO
                this.articleAsObservableHereInDetailPage$ =
*/
/* NO NO WAY
                    this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGotSecond) => {
                        this.articleAsObservableHereInDetailPage$ = articleIGotSecond;
                        }
                    )*/
            }
        ) // /.subscribe()
    } // /getArticle()

    getArticleViaSubscribe() {
        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                const articleIdHereInDetailPage = paramsIGot['article_id'];
                /* ^^
                That 'article_id' param name is
                 determined in the (Article) Routing Module
                 */
                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: Article) => {
                            console.log('9999 getArticle. articleIGot: ', articleIGot);
                            this.articleHereInDetailPage = articleIGot; // whamma-jamma?
                            console.log('9999 getArticle. this.articleHereInDetailPage ', this.articleHereInDetailPage);
                        }
                    );
            }
        )
    }

}
