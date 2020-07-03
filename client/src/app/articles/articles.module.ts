import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';


@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
  ],
  exports: [ // << I needed to EXPORT these; they are used in other Module scope (e.g. WelcomeComponent)
    ArticleComponent,
    ArticleListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
  ]
})
export class ArticlesModule { }
