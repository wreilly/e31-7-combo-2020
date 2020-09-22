import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleAddComponent } from './article-add/article-add.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleDetailTwoComponent } from './article-detail-two/article-detail-two.component';
import { ReactiveFormSelectFormControlComponent } from './reactive-form-select-form-control/reactive-form-select-form-control.component';
import { ArticlesComponent } from './articles.component';
import { ArticlesCategorizedComponent } from './articles-categorized/articles-categorized.component';
import { ArticlesCategorizedTwoComponent } from './articles-categorized-two/articles-categorized-two.component';


@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleAddComponent,
    ArticleDetailComponent,
    ArticleDetailTwoComponent,
    ReactiveFormSelectFormControlComponent,
    ArticlesComponent,
    ArticlesCategorizedComponent,
    ArticlesCategorizedTwoComponent,
  ],
  exports: [ // << I needed to EXPORT these; they are used in other Module scope (e.g. WelcomeComponent)
    ArticleComponent,
    ArticleListComponent,
    // ArticleAddComponent, // << t.b.d. ?
    ArticleDetailTwoComponent, // << needed here in exports ? apparently yes; see Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
  ]
})
export class ArticlesModule { }
