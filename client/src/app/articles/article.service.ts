import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
      private myHttp: HttpClient
  ) { }

  createArticle(myFormFieldsAndFiles: any) { // << FormData
    // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
    return this.myHttp.post(
        'http://0.0.0.0:8089/api/v1/articles/', // << TODO environment Url Stub!
        myFormFieldsAndFiles // << Just 2 fields for now
        );
  } // /createArticle()

}