import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Category } from '../article.model';

import { ArticleService } from '../article.service';

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

  categories: Category[] = [
    {
      value: 'world',
      viewValue: 'World',
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

  constructor(
      private myArticleService: ArticleService,
  ) { }

  ngOnInit(): void {
    // INITIATE FORM GROUP, CONTROLS
    this.articleTitle_formControl = new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
    ]);

    this.articleUrl_formControl = new FormControl(null,
        [
            Validators.required,
        ])

    this.articleCategory_formControl = new FormControl('News',[
        Validators.required,
    ])

    this.addArticleFormGroup = new FormGroup({
      'articleTitle_formControlName': this.articleTitle_formControl,
      'articleUrl_formControlName': this.articleUrl_formControl,
      'articleCategory_formControlName': this.articleCategory_formControl,
    });
  } // /ngOnInit()

  processReactiveFormAdd() { // TODO

    let myFormFieldsAndFiles: any;
    /*
    Phase I. Just FormFields
    Phase II. Files too (for Photo(s))
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

    this.goAddArticle(myFormFieldsAndFiles);

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
    my BACK-END Server API & Database *does* ultimately require:
articleToSave.articleUrl = req.body.articleUrl_name
articleToSave.articleTitle = req.body.articleTitle_name
/Users/william.reilly/dev/JavaScript/CSCI-E31/Assignments/07-final-CODE-CLEAN-UP/server/controllers/api/api-articleController.js
    -----

    So it is here (above) that I do employ that 'name' to be 'articleTitle_name' -- to match what the BE expects. cheers.
     */

    this.myFormFieldsData.append(
        'articleUrl_name',
        this.addArticleFormGroup.controls['articleUrl_formControlName'].value
    );

    /* N.B. For now, we do NOT append the (new) Category form field.
    (The BE knows nothing of it (yet).)
     */

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

    this.myArticleService.createArticle(myFormFieldsAndFiles)
        .subscribe(
            (whatIJustCreated) => {
              console.log('whatIJustCreated: ', whatIJustCreated);
              /*
              {articlePhotos: Array(0),
              _id: "5f032c5daf6229101f019065",
              articleUrl: "Are Protests Unsafe? What Experts Say May Depend on Who’s Protesting What",
              articleTitle: "https://www.nytimes.com/2020/07/06/us/Epidemiologists-coronavirus-protests-quarantine.html", __v: 0}
               */
              // this.addArticleFormGroup.reset();
            }
        );

  } // /goAddArticle()

}
