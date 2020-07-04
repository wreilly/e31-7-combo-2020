import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    //
  }

}
