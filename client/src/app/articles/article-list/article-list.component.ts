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
      articleId: 'article-list', // 'one_id',
      articleTitle: 'Article One',
      articleUrl: 'http://nytimes.com/one',
    },
    {
      articleId: 'two_id',
      articleTitle: 'Article Two',
      articleUrl: 'http://nytimes.com/two',
    },
    {
      articleId: 'three_id',
      articleTitle: 'Article Three',
      articleUrl: 'http://nytimes.com/three',
    },
  ];


  constructor() { }

  ngOnInit(): void {
    this.articles = [ ...this.testArticles ];
    console.log('this.(test)Articles! ', this.articles);
  }

}
