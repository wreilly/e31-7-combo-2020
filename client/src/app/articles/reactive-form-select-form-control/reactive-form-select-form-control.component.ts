import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Article, Category } from '../article.model'; // << Nope. Not Article. BE version instead.
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../article-add/article-add.component';
import { ArticleService } from '../article.service';

const ideaForInitialPatchValueArticle = {
    "articleTitle_formControlName": "idea for initial TITLE",
    "articleUrl_formControlName": "idea for initial URL",
    // "articleCategory_formControlName": "idea for initial CATEGORY e.g. Politics", // << NO
    // "articleCategory_formControlName": "Politics", // << NO
    "articleCategory_formControlName": "politics", // << NO
    "extraPropertyToDropOnFloor": "we do not use this - so there",
}
/* Hmm.
Seems to not matter (?) so far ? whether:
 'politics'  (a value that
IS found in an option 'value')
vs.
'Politics' (a viewValue, NOT found as an option 'value')
 */

@Component({
    selector: 'app-reactive-form-select-form-control',
    templateUrl: 'reactive-form-select-form-control.component.html',
    styleUrls: ['reactive-form-select-form-control.component.scss'],
})
export class ReactiveFormSelectFormControlComponent implements OnInit, AfterViewInit {

    articleHereInSpecialComponent: {
        /* As in "parent" ArticleDetailTwoComponent,
        this is BE version of an "Article",
        here in the ReactiveFormSelectFormControlComponent.
        A (very) "Special" Component.
        cheers.
         */
        _id: string,
        articlePhotos: string[],
        articleUrl: string,
        articleTitle: string,
        articleCategory: string,
    };

    articleDataForFormHereInSpecialComponent: any; // = { };
    // Will have same structure as 'ideaForInitialPatchValueArticle' above

    // === FROM "PARENT" ARTICLE-DETAIL-TWO.COMPONENT
    myFormFieldsData: FormData = new FormData();

    editArticleInSpecialComponentFormGroup: FormGroup;
    articleTitle_formControl: FormControl;
    articleUrl_formControl: FormControl;
    articleCategory_formControl: FormControl;

    myOwnErrorStateMatcher: MyErrorStateMatcher; // << imported ! very nice.

    public categories: Category[]; // << from ArticleService now. :o)
    // === /FROM "PARENT" ARTICLE-DETAIL-TWO.COMPONENT

    constructor(
        private myArticleService: ArticleService,
    ) {
    }

    @Input('articlePassedInName')
    articlePassedIn;

    ngOnInit() {

        this.articleHereInSpecialComponent = this.articlePassedIn;

        this.categories = this.myArticleService.getCategoriesInService();

        // === FROM "PARENT" ARTICLE-DETAIL-TWO.COMPONENT
        // INITIATE FormGroup, Controls
        this.articleTitle_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.minLength(10),
            ]);

        this.articleUrl_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.pattern(
                    /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
                ),
            ]);
        /* URL_REGEXP from: (2015)
https://github.com/angular/angular.js/commit/ffb6b2fb56d9ffcb051284965dd538629ea9687a
 */

        this.articleCategory_formControl = new FormControl(null,
            [
                Validators.required,
            ]);

        this.editArticleInSpecialComponentFormGroup = new FormGroup({
            'articleTitle_formControlName': this.articleTitle_formControl,
            'articleUrl_formControlName': this.articleUrl_formControl,
            'articleCategory_formControlName': this.articleCategory_formControl,
        });

        this.myOwnErrorStateMatcher = new MyErrorStateMatcher(); // << imported.

        // TODO this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

        // === /FROM "PARENT" ARTICLE-DETAIL-TWO.COMPONENT


        this.articleDataForFormHereInSpecialComponent = {
            // Object Literal initializer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

            // Will have same structure as 'ideaForInitialPatchValueArticle' above

            "articleTitle_formControlName": this.articleHereInSpecialComponent.articleTitle,
            "articleUrl_formControlName": this.articleHereInSpecialComponent.articleUrl,
            // "articleCategory_formControlName": "idea for initial CATEGORY e.g. Politics", // << NO
            // "articleCategory_formControlName": "Politics", // << NO
            "articleCategory_formControlName": this.articleHereInSpecialComponent.articleCategory, // Finally YES. << ?? No. Curse it.
            "extraPropertyToDropOnFloor": "we do not use this - so there pourquoi pas?",

        };



/*
        this.editArticleInSpecialComponentFormGroup.patchValue(
            ideaForInitialPatchValueArticle
        );
*/
/* Yeah Partial
Title, Url worked, with initial values in form.
Category showed: "NEWS-Service"
Also we saw on U/I:
SPECIAL COMPONENT articleCategory_formControl.value | "politics"
*/

        this.editArticleInSpecialComponentFormGroup.patchValue(
            this.articleDataForFormHereInSpecialComponent
        );
        /* Yeah Partial
        Title, Url worked, with initial values in form.
        Category showed: "News" << Non es muy bueno pero.
        Also we saw on U/I:
        SPECIAL COMPONENT articleCategory_formControl.value | "World"
        */

        /*
                this.editArticleInSpecialComponentFormGroup.patchValue(
                    this.articleHereInSpecialComponent
                );
                Nothing. All 3 fields empty.
                Going to try ngAfterViewInit() << same result. hmm
        */

    } // /ngOnInit()

    ngAfterViewInit() { //  NUTTIN' DOIN' :o(
        /*
                this.editArticleInSpecialComponentFormGroup.patchValue(
                    ideaForInitialPatchValueArticle
                );
 HMM. ?  Well, this error NOT seen when run in ngOnInit() instead of here. Bueno.

 core.js:6228 ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'null'. Current value: '"Politics"'.
         */
/*
        Title, Url worked, with initial values in form.
        Category showed: "NEWS-Service"
        Also we saw on U/I:
        SPECIAL COMPONENT articleCategory_formControl.value | "politics"
        */

/*
*         Nothing. All 3 fields empty.
* */
/*
        console.log('ngAfterViewInit(). this.articleHereInSpecialComponent ', this.articleHereInSpecialComponent);
        /!* BE "Article"
        articleCategory: "No Category "viewValue" (thx Service!)"
articlePhotos: ["["sometimes__1526216263665_051218krugman1-jumbo.pn…es__1526216263668_051218krugman3-superJumbo.png"]"]
articleTitle: "What’s Less Edit URL We Be EdTNG MORE REACTIVELY Good for Pharma Isn’t Good for America (Wonkish)"
articleUrl: "https://www.nytimes.com/2020/08/15/us/covid-college-tuition.html"
__v: 0
_id: "5af83649f2fffa14c4a22cd7"
         *!/
        this.editArticleInSpecialComponentFormGroup.patchValue(
            this.articleHereInSpecialComponent
        ); // << NOPE
*/


    } // /ngAfterViewInit()



    processSpecialComponentEdit() {

    }

    myCompareOptionCategoryValues(
        optionCategory1: any,
        optionCategory2: any
    ): boolean {
        console.log('COMPARE 1 ', optionCategory1); // living
        console.log('COMPARE 2 ', optionCategory1); // living
        return optionCategory1 && optionCategory2 ? optionCategory1 === optionCategory2 : optionCategory1 === optionCategory2; // NEWS-Service ?
/*
        return optionCategory1 && optionCategory2 ? optionCategory1.viewValue === optionCategory2.viewValue : optionCategory1 === optionCategory2; // NEWS-Service ?
*/
        // return optionCategory1 && optionCategory2 ? optionCategory1.value === optionCategory2.value : optionCategory1 === optionCategory2; // NEWS-Service ?
    } // /myCompareOptionsCategoryValues()

}
