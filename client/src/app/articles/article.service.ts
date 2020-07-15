import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Article} from "./article.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
      private myHttp: HttpClient
  ) { }

  createArticle(myFormFieldsAndFiles: any): Observable<Object> { // << FormData
    // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
    return this.myHttp.post(
        'http://0.0.0.0:8089/api/v1/articles/', // << TODO environment Url Stub!
        myFormFieldsAndFiles // << Just 2 fields for now
        );
  } // /createArticle()

  listArticles(): Observable<Object> {
    // GET ALL Articles
    // DON'T FORGET THAT BLOODY 'return' !!! !!! !!!
    return this.myHttp.get(
        'http://0.0.0.0:8089/api/v1/articles/',
    );
  }

  getArticle(idPassedIn) {
    return this.myHttp.get(
        `http://0.0.0.0:8089/api/v1/articles/${idPassedIn}`
    );
  }

  getArticleMostRecent() {
    return this.myHttp.get(
        `http://0.0.0.0:8089/api/v1/articles/recent`
    );
  }

}
