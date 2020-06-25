import { Component, OnInit } from '@angular/core';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "../../core/services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isThemeDarkInComponent: boolean;

  constructor(
      private myThemeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.myThemeService.isThemeDarkInServiceObservable
        .subscribe(
            (whatIGot) => {
              console.log('OnInit. ThemeDark subscribe whatIGot: boolean - ', whatIGot);
              this.isThemeDarkInComponent = whatIGot;
            }
        )
  }

  onThemeChange(checkedOrNot: boolean) {
    this.myThemeService.setThemeToggle(checkedOrNot);
  }

}
