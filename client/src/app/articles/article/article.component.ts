import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../article.model';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

    @Input('articleToSendDownName')
    articleHere: Article;
/* Better name above ^^
    articleToSendDown: Article;
*/
    myDate: Date;
    /* FINDING
    I'll use just ngOnChanges(), not ngOnInit(), for 'myDate'.

    N.B.  "ngOnChanges() is called when any data-bound property of a directive changes"
           https://angular.io/api/core/OnChanges

    For ONE scenario: ArticleAddComponent
    - ngOnInit() is TOO LATE. myDate not seen.
    - ngOnChanges() is OK. myDate works okay.
    Scenario is regarding the initial load of this ArticleComponent
    when rendered inside parent ArticleAddComponent.
    Why? Because that parent does asynchronous call to obtain "Most Recent" Article.
    That call comes back TOO LATE to be part of the ArticleComponent ngOnInit().
    But is DOES work OK for ngOnChanges().

    For ANOTHER scenario: ArticleListComponent
    - ngOnInit() is OK. myDate works okay.
    - ngOnChanges() is OK. myDate works okay.
    Scenario is ArticleComponent in an *ngFor loop
    inside the ArticleListComponent.
    In that scenario, the data in the array of all articles is
    already in hand, arrived. The *ngFor just drops in
    article-by-article - no delay. ngOnInit() works OK.
     */

    ngOnInit() {
        // console.log('ARTICLE. ngOnInit(). this.articleHere: ', this.articleHere);
        /* Yes. but hmm "Object" ?
        articlePhotos: []
articleTitle: "Good King Wenceslas Looked Out"
articleUrl: "http://nytimes.com/oboywhatdoeslogginglooklike"
__v: 0
_id: "5f0d8e09c56b84504e7b0ab3"
         */
        if (false) { // << Blocking use here. See ngOnChanges() instead, and FINDING up above.
        // if (this.articleHere) {

// https://stackoverflow.com/questions/13350642/how-to-get-creation-date-from-object-id-in-mongoose
            const myTimestamp = this.articleHere.articleId_name.toString().substring(0,8);

            this.myDate = new Date( parseInt( myTimestamp, 16 ) * 1000 );

            console.log('INIT this.myDate be ', this.myDate);
/*
this.myDate be  Tue Jul 14 2020 15:51:12 GMT-0400 (Eastern Daylight Time)
 */
        }
    } // /ngOnInit()

    ngOnChanges() {
        // if (false) {
        if (this.articleHere) {

// https://stackoverflow.com/questions/13350642/how-to-get-creation-date-from-object-id-in-mongoose
            const myTimestamp = this.articleHere.articleId_name.toString().substring(0,8);

            this.myDate = new Date( parseInt( myTimestamp, 16 ) * 1000 );

            // console.log('CHANGES this.myDate be ', this.myDate);
            /*
            this.myDate be  Tue Jul 14 2020 15:51:12 GMT-0400 (Eastern Daylight Time)
             */
        }
    }

}
