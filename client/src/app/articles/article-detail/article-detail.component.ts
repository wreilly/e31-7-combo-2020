import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model'; // << ?? t.b.d.

@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

    articleHereInDetailPage: Article;

    constructor(
        private myArticleService: ArticleService,
        private myActivatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.getArticle();
    }

    getArticle() {
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
                            console.log('getArticle. articleIGot: ', articleIGot);
                            this.articleHereInDetailPage = articleIGot; // whamma-jamma?
                            console.log('getArticle. this.articleHereInDetailPage ', this.articleHereInDetailPage);
                        }
                    );
            }
        )
    }

}
