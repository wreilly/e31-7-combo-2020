import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Category } from '../article.model';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.scss']
})
export class ArticleAddComponent implements OnInit {

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

  constructor() { }

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

    console.log('his.addArticleFormGroup.value ', this.addArticleFormGroup.value);
    /* Oh Yeah:
    {
      articleTitle_formControlName: "we are family",
      articleUrl_formControlName: "i got all my sisters and me",
      articleCategory_formControlName: "politics"
    }
     */

    this.addArticleFormGroup.reset();

  }

}
