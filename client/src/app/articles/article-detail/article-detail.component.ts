import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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

    /*
    CHILD-to-PARENT "Communication" ** by way of <router-outlet> **
    https://medium.com/@sujeeshdl/angular-parent-to-child-and-child-to-parent-communication-from-router-outlet-868b39d1ca89
     */
    @Output()
    tellingYouMyId: EventEmitter<string> = new EventEmitter<string>();


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

/* NO. (dummy)
        // Take two: << D'oh. No. Too soon. Gotta wait for async call above!!
        this.tellingYouMyId.emit(this.articleHereInDetailPage.articleId_name);
        // SENDING TO PARENT ARTICLES.COMPONENT
*/
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

/* Take one: TOO SOON (throws below error, but did get the ID value, fwiw.)
                this.tellingYouMyId.emit(articleIdHereInDetailPage);
                // SENDING TO PARENT ARTICLES.COMPONENT

ERROR:
" Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'undefined'. Current value: '5af746cea7008520ae732e2c'.
    at throwErrorIfNoChangesMode (core.js:8147)"

    https://blog.angular-university.io/angular-debugging/
    "Expression has changed after it was checked": Simple Explanation (and Fix)
*/

                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: any) => {
                            console.log('getArticle 3333!');
                            console.log('9999 getArticle. articleIGot: ', articleIGot);

                            this.articleHereInDetailPage = articleIGot; // BOOM.
                            this.articleAsOneItemArrayHereInDetailPage.push( articleIGot);
                            // Take three: ("the charm") :)
                            this.tellingYouMyId.emit(articleIdHereInDetailPage);
                            // SENDING TO PARENT ARTICLES.COMPONENT
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
