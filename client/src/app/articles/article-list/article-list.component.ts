import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  articles = [];

  testArticles = [
    {
      articleId_name: 'article-list', // 'one_id',
      articleTitle_name: 'Article One',
      articleUrl_name: 'http://nytimes.com/one',
    },
    {
      articleId_name: 'two_id',
      articleTitle_name: 'Article Two',
      articleUrl_name: 'http://nytimes.com/two',
    },
    {
      articleId_name: 'three_id',
      articleTitle_name: 'Article Three',
      articleUrl_name: 'http://nytimes.com/three',
    },
  ];


  constructor() { }

  ngOnInit(): void {
    this.articles = [ ...this.testArticles ];
    console.log('this.(test)Articles! ', this.articles);
  }

}
