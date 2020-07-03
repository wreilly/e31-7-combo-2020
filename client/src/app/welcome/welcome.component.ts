import { Component, OnInit } from '@angular/core';

// import from '../core/services/article.service'; // TODO

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  title = 'Some Times 2020';
  subTitle = 'Newspaper Articles Reference Site';
  // apiUrlStubInWelcome = apiUrlStubInService; // TODO

  constructor() { }

  ngOnInit(): void {
  }

}
