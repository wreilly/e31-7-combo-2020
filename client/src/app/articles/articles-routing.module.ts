import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import {ArticleComponent} from "./article/article.component"; // << Nope.
import {ArticlesComponent} from "./articles.component";
import {ArticleListComponent} from "./article-list/article-list.component";
import { ArticlesCategorizedComponent } from './articles-categorized/articles-categorized.component';
import { ArticlesCategorizedTwoComponent  } from './articles-categorized-two/articles-categorized-two.component';
import { ArticleAddComponent } from "./article-add/article-add.component";
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleDetailTwoComponent } from './article-detail-two/article-detail-two.component';


const myArticleRoutes: Routes = [
    {
        // path: 'article-list',
        // path: 'articles/', // << Very Fussy! No! final '/'. boo-hiss.
        path: 'articles',
        // path: '', // << ? No. o la.
        // pathMatch: 'full', // << No. breaks the links below (e.g. /articles/list)
        component: ArticlesComponent,
        children: [
            {
                path: 'list',
                component: ArticleListComponent,
            },
            {
                path: 'categorized',
                component: ArticlesCategorizedTwoComponent,
            },
            {
                path: 'add',
                component: ArticleAddComponent,
            },
            {
                path: ':article_id',
                // component: ArticleDetailComponent,
                component: ArticleDetailTwoComponent,
            },
            {
                path: ':article_id/edit',
                // component: ArticleDetailComponent,
                component: ArticleDetailTwoComponent,
            },
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(myArticleRoutes)
    ],
    exports: [
        RouterModule,
    ],
    declarations: [

    ],
    providers: [

    ],
})
export class ArticlesRoutingModule { }
