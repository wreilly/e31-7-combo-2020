import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import {Observable} from 'rxjs';

import {Article, Category} from '../article.model';

import {ArticleService} from '../article.service';


import {ErrorStateMatcher} from '@angular/material/core';
/*
https://www.concretepage.com/angular-material/angular-material-inputs#ErrorStateMatcher
// 2020 NOTE! "Just so you know", now comes from '@angular/material/core' - So There! (Was (2019...) '@angular/material' o well

Here in ArticleAddComponent, this ErrorStateMatcher,
is an example of "special" Angular Material import needed
BEYOND what our "my-material.module.ts" covers for us.
*/
/* (btw)
This "matcher" is used because w. Angular Material and form reset(), the default is to call it an error if the form was ever submitted.
With the custom matcher, we can omit that default criterion.
 */

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
/*
// We OMIT to include form.submitted

        // https://medium.com/better-programming/javascript-bang-bang-i-shot-you-down-use-of-double-bangs-in-javascript-7c9d94446054
        // TL;DR "The !! (double bang) logical operators return a value’s truthy value."

        https://itnext.io/materror-cross-field-validators-in-angular-material-7-97053b2ed0cf
 */
/* FURTHER NOTE on ErrorStateMatcher
For EDITING (not during "Create") the CATEGORY <mat-select>, over in ArticleDetailTwoComponent,
we have SPECIAL NEED for a custom ErrorStateMatcher.
It has function to ensure the value is indeed one of the <mat-option>s.
Why?
Because we have/can-have older, existing, dirty data: NO category; WRONG VALUE in Category
 */

export class MyCategoriesEnumLikeClass {
/* *****   NOT USED  *************

Categories are NOT used from this list/array
here in the ArticleAddComponent

See instead ArticleService

***********************************
 */


  // FREE RIDE EXPERIMENT ****  UTILITIES ETC :o)  ******
// NOT USED NOW. Experiment's over, kids.
/*
  public myHowManyCharsTypedFromEnumLikeClass(): number {
    // HARD-CODED AS ALL GET OUT
    // But it DID WORK, to get that value of '20' over to ArticleDetailComponent. cheers
    /!*
        howMany = (
            this.addArticleFormGroup.get(formControlNamePassedIn).value
            &&
            this.addArticleFormGroup.get(formControlNamePassedIn).value.length
        );
    *!/
    return 20;
  }
*/

  // /FREE RIDE EXPERIMENT ****  UTILITIES ETC :o)  ******

  categoriesFromEnumLikeClass: Category[] = [
      /* ***** NOT USED  ***** See SERVICE */
      // New York Times categories
    // N.B. 'News' is default TODONOPE how is its *value* handled? hmm
    {
      value: 'world',
      viewValue: 'World-ENUM-LIKE',
    },
    {
      value: 'u.s.',
      viewValue: 'U.S.',
    },
    {
      value: 'politics',
      viewValue: 'Politics',
    },
    {
      value: 'business',
      viewValue: 'Business',
    },
    {
      value: 'opinion',
      viewValue: 'Opinion',
    },
    {
      value: 'arts',
      viewValue: 'Arts',
    },
    {
      value: 'living',
      viewValue: 'Living',
    },
  ];
}

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.scss']
})
export class ArticleAddComponent implements OnInit {

  myFormFieldsData: FormData = new FormData(); // << from HTML

  addArticleFormGroup: FormGroup;

  articleTitle_formControl: FormControl;
  articleUrl_formControl: FormControl;
  articleCategory_formControl: FormControl;

  myOwnErrorStateMatcher: MyErrorStateMatcher;

  articleIJustCreatedBoolean = false;
  articleIJustCreatedDisplayBE: {
    _id: string,
    articleTitle: string,
    articleUrl: string,
  };
  articleIJustCreatedDisplayFE: Article;

  articleMostRecentDisplayBE: {
    _id: string,
    articleTitle: string,
    articleUrl: string,
  };
  articleMostRecentDisplayFE: Article;

  public categories: Category[]; // << from ArticleService now. :o)
  public categoriesOLD: Category[] = [
      /* ***  NOT USED ************
      See instead ArticleService
      for canonical (only) list of
      CATEGORIES []
      ******************************
       */
      // New York Times categories
    /* 1. N.B. 'News' is default
    Note 'News' is *not* found in below array
    TODONE Q. How is 'News' *value* handled? hmm
     */
      /* re: # 1 above:
      A. See HTML: Appears we bind the value there: t.b.d. if all working right...
          <mat-option bind-value="'News-BOUND-VALUE'">News-HTML</mat-option>
       */
      // 2. Unsure if making 'categories' to be 'public' helps, matters, etc. o well
    {
      value: 'world',
      viewValue: 'World-REGULAR-ARTICLEADDCOMPONENT',
    },
    {
      value: 'u.s.',
      viewValue: 'U.S.',
    },
    {
      value: 'politics',
      viewValue: 'Politics',
    },
    {
      value: 'business',
      viewValue: 'Business',
    },
    {
      value: 'opinion',
      viewValue: 'Opinion',
    },
    {
      value: 'arts',
      viewValue: 'Arts',
    },
    {
      value: 'living',
      viewValue: 'Living',
    },
  ];

  myUIIsLoadingStore$: Observable<boolean>;

  constructor(
      private myArticleService: ArticleService,
      private myStore: Store,
      private myRouter: Router,
  ) { }

  ngOnInit(): void {

    // Get Categories[] from ArticleService
    this.categories = this.myArticleService.getCategoriesInService();

    // INITIATE FORM GROUP, CONTROLS
    this.articleTitle_formControl = new FormControl( null, [
        Validators.required,
        Validators.minLength(10),
    ]);
    /* Note:
    Yes, the "default formState" works here on plain string input:
    'little default TITLE for ya'
    But see below re: select (don't work!) boo.
     */

    this.articleUrl_formControl = new FormControl(null,
        [
            Validators.required,
            Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/)
        ]);
    /* URL_REGEXP from: (2015)
    https://github.com/angular/angular.js/commit/ffb6b2fb56d9ffcb051284965dd538629ea9687a
     */

    /*
    Hmm. Seems that initializing the FormControl for Category - works (not breaking things, as I Add an Article)
     for both "init" values:
    - as a Category literal object (w. default choice of News, but that is not seen on U/I)
    - as simple null
    Unclear yet what that initial value and type does, when the code (at present) goes on
    to basically assign just a single string to the FormControl value e.g. 'u.s.' for BE ".value"
    Next will be (I think ?) to get the value on the FormControl to be the whole Category object:
    { value: 'u.s.', viewValue: 'U.S.'}
    Then to get at the FE "display" one, would be FormControl.value.viewValue << I believe
    And the BE "stored" one would be FormControl.value.value  << I think

    SEE ALSO ArticleDetailTwoComponent re: EDITING
     */
/* This "didn't break" adding an Article, but, seems not super intuitive. Let's not use.
(The AddArticle form Category formControl was still (appropriately) empty. It did NOT show a "default" of "News". Good. (I guess))

    this.articleCategory_formControl = new FormControl({value: 'news', viewValue: 'News'},[
        Validators.required,
    ]);
*/
/* WORKING FINE ... */
    this.articleCategory_formControl = new FormControl(null, [
      Validators.required,
    ]);

    /* Note:
Here on a SELECT form element, this "default formState" does *NOT* work (boo).
'News-DEFAULT'   nor  'News-SERVICE'
Nor:
{ value: 'default value', viewValue: 'default viewValue'}
 */


    this.addArticleFormGroup = new FormGroup({
      'articleTitle_formControlName': this.articleTitle_formControl,
      'articleUrl_formControlName': this.articleUrl_formControl,
      'articleCategory_formControlName': this.articleCategory_formControl,
    });

    this.myOwnErrorStateMatcher = new MyErrorStateMatcher();

    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);

    this.getArticleMostRecent();

  } // /ngOnInit()

  getArticleMostRecent() {
    this.myArticleService.getArticleMostRecent()
        .subscribe(
            (whatIGot:{
              _id: string,
              articleTitle: string,
              articleUrl: string,
              articleCategory: string,
            }) => {
              console.log('Most Recent. whatIGot BE ', whatIGot);
              /* Huh. ARRAY (of one)
              [{…}]
              articlePhotos: []
articleTitle: "sdfasdfasdf"
articleUrl: "https://nytimes.com/necessarythecat"
__v: 0
_id: "5f0dd9c93c5a35425badb560"
               */

              this.articleMostRecentDisplayBE = whatIGot; // << whamma-jamma for BE flavor
              console.log('fwiw, this.articleMostRecentDisplayBE ', this.articleMostRecentDisplayBE);
/*
ARRAY of one - same as above.
 */

/* =====================================
   TIME TO "CONVERT" TO THE "FE NAMING CONVENTION" for an Article
   =====================================
   (cf. where we do NOT need to (bother) "converting" - when BE object
   is used directly on the HTML template:
   src/app/articles/article-detail/article-detail.component.ts:219
*/
              // 04  ** YES **  Object Literal Initializer << whoa
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
              // N.B. 1st item off ARRAY[0] <<

              /* CATEGORY FIXER */
              /*
              Go get 'viewValue' for the (stored) 'value'
    returned from the DB.
    e.g. 'u.s.' as value will return 'U.S.' as viewValue
               */
              let categorySuchAsItIsReturned: string;
              categorySuchAsItIsReturned = this.myArticleService.getCategoryViewValue(whatIGot[0].articleCategory)


              this.articleMostRecentDisplayFE = {
                articleId_name: whatIGot[0]._id,
                articleTitle_name: whatIGot[0].articleTitle,
                articleUrl_name: whatIGot[0].articleUrl,
                articleCategory_name: categorySuchAsItIsReturned,
                // articleCategory_name: whatIGot[0].articleCategory,
              };
              console.log('*MUCH* MORE BETTER fwiw, this.articleMostRecentDisplayFE $$$ :o) ', this.articleMostRecentDisplayFE);
              /* "FE NAMING CONVENTION" = bueno
              This is officially of 'Type' 'Article' - good.
Hmm:
{articleId_name: undefined
articleTitle_name: undefined
articleUrl_name: undefined}
               */

            }
        );
  } // getArticleMostRecent()

  processReactiveFormAdd(): void { // TODO ?

    let myFormFieldsAndFiles: any;
    /*
    Phase I. Just FormFields
    Phase II. Files too (for Photo(s))

    Note: I believe I use 'any' here
    because either (a) too tricky etc.
    to use HTML's 'FormData', or
    (b) because in the end it really is
    more than 'FormData' ( ? ). Not sure.
    Either way, 'any' gets you there, seems.
     */

    console.log('this.addArticleFormGroup.value ', this.addArticleFormGroup.value);
    /* Oh Yeah:
    {
      articleTitle_formControlName: "we are family",
      articleUrl_formControlName: "i got all my sisters and me",
      articleCategory_formControlName: "politics"
    }
     */

    myFormFieldsAndFiles = this.prepareToAddArticleReactiveForm();
    /*
    Note that the above method does
    'return FormData'.
    We here assign that to type 'any'.
    fwiw.
    Phase I: Note also - just Form Fields now, no Files yet
     */

    this.goAddArticle(myFormFieldsAndFiles);
    /*
        Phase I: Note also - just Form Fields now, no Files yet
     */

    // Not Here
    // this.addArticleFormGroup.reset();

  } // /processReactiveFormAdd()


  private prepareToAddArticleReactiveForm(): FormData {

    // YES
    console.log('-01A- this.addArticleFormGroup.controls[\'articleTitle_formControlName\'].value ', this.addArticleFormGroup.controls['articleTitle_formControlName'].value); // Yes what's in input box

    // YES
    console.log('-01B- this.addArticleFormGroup.controls.articleTitle_formControlName.value ', this.addArticleFormGroup.controls.articleTitle_formControlName.value);

    this.myFormFieldsData.append(
        'articleTitle_name',
        this.addArticleFormGroup.controls.articleTitle_formControlName.value
        );
    /* Note on above 'name'
    As discussed in comment in the HTML:
    -----
    1. Right here, coming off the FE form, the field naming convention has that '_formControlName' on it, e.g., 'articleTitle_formControlName'
    2. But my BACK-END Server API & Database *does* ultimately require the field naming convention ending in simply '_name':
articleToSave.articleUrl = req.body.articleUrl_name
articleToSave.articleTitle = req.body.articleTitle_name
/Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/server/controllers/api/api-articleController.js
    -----

    3. To address that, it is here (just above) that I do employ that 'name' attribute to change it from the FE convention, to the BE convention: 'articleTitle_name' -- to match what the BE expects. cheers.
     */

    this.myFormFieldsData.append(
        'articleUrl_name',
        this.addArticleFormGroup.controls['articleUrl_formControlName'].value
    );

    /* N.B. For now, we do NOT append the (new) Category form field.
    (The BE knows nothing of it (yet).)
     */
    /*

     */

    this.myFormFieldsData.append(
        'articleCategory_name',
        this.addArticleFormGroup
            .controls['articleCategory_formControlName'].value
    );

    /*
    Q. console.log() ?
    A. Nah! Not for FormData kids!
    Instead we send it out over the wire, look at the
    DevTools Network Tab "Request Payload". cheers.
     */
    let myXhr = new XMLHttpRequest();
    myXhr.open('POST', '/FAKE-URL-REACTIVE-FORM', true);
    myXhr.send(this.myFormFieldsData);

    /* Q. What did we get from above?
       A. This!
==============
"Source"
------WebKitFormBoundary9BIaKg5mLFZFATKo
Content-Disposition: form-data; name="articleTitle_name"

over the wire or what
------WebKitFormBoundary9BIaKg5mLFZFATKo
Content-Disposition: form-data; name="articleUrl_name"

http://nytimes.com/oboy
------WebKitFormBoundary9BIaKg5mLFZFATKo--
==============
"Parsed"
articleTitle_name: over the wire or what
articleUrl_name: http://nytimes.com/oboy
     */

    return this.myFormFieldsData; // Just 2 fields, not 3.

  } // /prepareToAddArticleReactiveForm()


  goAddArticle(myFormFieldsAndFiles): void {
/*
    this.myArticleService.createArticle(myFormFieldsAndFiles)
*/
    this.myArticleService.createArticleB(myFormFieldsAndFiles)
        .subscribe(
            (whatIJustCreated: {
              _id: string,
              articleTitle: string,
              articleUrl: string,
              articleCategory: string,
            }) => {
              console.log('ARTICLE "B" - whatIJustCreated: ', whatIJustCreated);
              /* FEATURES THE "BE NAMING CONVENTION" for an Article. Bueno.
              {articlePhotos: Array(0),
              _id: "5f032c5daf6229101f019065",
              articleUrl: "Are Protests Unsafe? What Experts Say May Depend on Who’s Protesting What",
              articleTitle: "https://www.nytimes.com/2020/07/06/us/Epidemiologists-coronavirus-protests-quarantine.html", __v: 0}
               */

              this.articleIJustCreatedBoolean = true;
              this.articleIJustCreatedDisplayBE = whatIJustCreated; // << whamma-jamma? yeah, for this BE flavor

              console.log('fwiw, this.articleIJustCreatedDisplayBE !!! ', this.articleIJustCreatedDisplayBE);
              /* Yes
              {articlePhotos: Array(0), _id: "5f0d89417cd8e02f304f4070", articleUrl: "http://nytimes.com/oboyasdf", articleTitle: "I did just create this, but who knows", articleCategory: "politics", __v: 0}
               */

              /* =====================================
                 TIME TO "CONVERT" TO THE "FE NAMING CONVENTION" for an Article
                 =====================================
                 Note: for CATEGORY, for this "conversion" for FE use,
                 we want to use the 'viewValue', not the (DB) 'value' that gets stored. cheers.
                 'U.S.' not 'u.s.'

                 Below, I get WRONG the Object creation etc. 3 different ways. Then it works: "Object literal" - oi.
               */
              // 01 WRONG. Not Object.assign()
/*
              this.articleIJustCreatedDisplayFE = Object.assign({
                articleId_name: whatIJustCreated._id,
                articleTitle_name: whatIJustCreated.articleTitle,
                articleUrl_name: whatIJustCreated.articleUrl
              }, whatIJustCreated)
*/
/*
              console.log('fwiw, this.articleIJustCreatedDisplayFE !!! $$$ :o) ', this.articleIJustCreatedDisplayFE);
*/
              /* Hmm. No. (wassup?)
              It is (now ?) keeping the original
              properties too. hmm. TODONOPE fix
              articleId_name: "5f0daf9584c76c1887b06e14"
articlePhotos: []
articleTitle: "nononononoo"
articleTitle_name: "nononononoo"
articleUrl: "https://nytimes.com/focusissimo"
articleUrl_name: "https://nytimes.com/focusissimo"
__v: 0
_id: "5f0daf9584c76c1887b06e14"

               */


              // 02 WRONG. Not Object.create()
/*
              this.articleIJustCreatedDisplayFE = Object.create({
                articleId_name: whatIJustCreated._id,
                articleTitle_name: whatIJustCreated.articleTitle,
                articleUrl_name: whatIJustCreated.articleUrl
              });
*/
/*
              console.log('MORE BETTER fwiw, this.articleIJustCreatedDisplayFE !!! $$$ :o) ', this.articleIJustCreatedDisplayFE); // {} << empty. yucky
*/

              // 03  WRONG. NAH. new Object() has issues - see error below
/*
              this.articleIJustCreatedDisplayFE = new Object({
                articleId_name: whatIJustCreated._id,
                articleTitle_name: whatIJustCreated.articleTitle,
                articleUrl_name: whatIJustCreated.articleUrl
              });
*/
              /*
              TS2696: The 'Object' type is assignable to very few other types. Did you mean to use the 'any' type instead?   Type 'Object' is missing the following properties from type 'Article': articleId_name, articleTitle_name, articleUrl_name
               */

              // 04  ** YES **  Object Literal Initializer << whoa
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer

              /* CATEGORY FIXER
              Go get 'viewValue' for the 'value' returned from the DB.
              e.g. 'u.s.' as value will return 'U.S.' as viewValue
               */
              // TODO: You could go get this "categoryViewValue" now from ArticleService, n'est-ce pas?
              const categoryViewValue = this.categories.find( // << Array 'find()', not Array 'filter()' No.
                  (eachCategoryPair: Category) => {
                    return eachCategoryPair.value === whatIJustCreated.articleCategory;
                  }
              );


              this.articleIJustCreatedDisplayFE = {
                articleId_name: whatIJustCreated._id,
                articleTitle_name: whatIJustCreated.articleTitle,
                articleUrl_name: whatIJustCreated.articleUrl,
                // articleCategory_name: whatIJustCreated.articleCategory, // << This gives you 'value' stored to DB. e.g. 'u.s.'
                articleCategory_name: categoryViewValue.viewValue, // << This gives you 'viewValue' for FE. e.g. 'U.S.'
              };
              console.log('*MUCH* MORE BETTER fwiw, this.articleIJustCreatedDisplayFE !!! $$$ :o) ', this.articleIJustCreatedDisplayFE);
              /* "FE NAMING CONVENTION" = bueno
              This is officially of 'Type' 'Article' - good.

              {
              articleCategory_name: "U.S."
articleId_name: "5f439278de0332f93052f8e6"
articleTitle_name: "Why Are Coronavirus Cases Decreasing? Experts Say Restrictions Are Working"
articleUrl_name: "https://www.nytimes.com/interactive/2020/08/24/us/coronavirus-cases-decreasing.html"
              }

              {articleId_name: "5f0dd3a63c5a35425badb55f",
              articleTitle_name: "texas hold em",
              articleUrl_name: "https://nytimes.com/focusissimo99"}
               */

              this.addArticleFormGroup.reset();
            }
        );

  } // /goAddArticle()

  letUsCancelAdding() {
    this.myRouter.navigate(
        ['/'], // << WAS ['/articles'] Home seems better UX. cheers.
        // And Home#top-header-anchor, even better. cheers.
        {
          fragment: 'top-header-anchor', // Yeah, working (finally). See AppRoutingModule!
          state: {
            data: {
              articleMostRecentHideRouterLinkState: false
            }
          }
        }
    );
    /*
      https://medium.com/ableneo/how-to-pass-data-between-routed-components-in-angular-2306308d8255

https://angular.io/api/router/NavigationExtras#state

                            [state]="{data: {
                            articleMostRecentHideRouterLinkState: false
                            }}"
     */
  }

  //  ****  UTILITIES ETC :o)  ******

  myHowManyCharsTyped(formControlNamePassedIn: string): number {
    let howMany;
    howMany = (
        this.addArticleFormGroup.get(formControlNamePassedIn).value
        &&
            this.addArticleFormGroup.get(formControlNamePassedIn).value.length
    );
    return howMany;
  }

}
