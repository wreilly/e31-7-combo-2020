import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ArticleComponent} from "./article/article.component";
import {ArticleListComponent} from "./article-list/article-list.component";

const myArticleRoutes: Routes = [
/*    {
        path: 'articles', // ? /articles ?
        component: ArticleComponent, // temporary
    },*/
    {
        path: 'article-list',
        component: ArticleListComponent,
    },
/*
    {
        path: ':article_id', // << ?
        component: ArticleComponent,
    },
*/
];

@NgModule({
    imports: [
        RouterModule.forChild(myArticleRoutes),
    ],
    exports: [
        RouterModule,
    ],
    declarations: [

    ],
    providers: [

    ],
})
export class ArticlesRoutingModule {

}
