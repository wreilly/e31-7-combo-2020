import { Component, Input } from '@angular/core';
import { Article } from '../article.model';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

    @Input('articleToSendDownName')
    articleToSendDown: Article;

}
