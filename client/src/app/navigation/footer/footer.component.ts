import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goToTop() {
    console.log('goToTop!');
    /* Frank goodness:
    document.querySelector('mat-sidenav-content').scrollTop = 1500;
    https://github.com/angular/components/issues/11552
     */
    document.querySelector('mat-sidenav-content').scroll(
        {
          top: 0,
          left: 0,
          behavior: 'smooth'
        }
    );
    // window.scrollTo(0, 0); // << No.
/*  No.
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
*/
  }

}
