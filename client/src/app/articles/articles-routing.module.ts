import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import {ArticleComponent} from "./article/article.component"; // << Nope.
import {ArticlesComponent} from "./articles.component";
import {ArticleListComponent} from "./article-list/article-list.component";
import { ArticleAddComponent } from "./article-add/article-add.component";
import { ArticleDetailComponent } from './article-detail/article-detail.component';


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
                path: 'add',
                component: ArticleAddComponent,
            },
            {
                path: ':article_id',
                component: ArticleDetailComponent,
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
