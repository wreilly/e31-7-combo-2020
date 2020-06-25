import { Component } from '@angular/core';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "./core/services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'clienty-2020';

  isThemeDarkInAppComponent: boolean; // = false;

  constructor(
      private myThemeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.myThemeService.isThemeDarkInServiceObservable
        .subscribe(
            (whatIGot) => {
              console.log('OnInit. ThemeDark subscribe whatIGot: boolean - ', whatIGot);
              this.isThemeDarkInAppComponent = whatIGot;
            }
        )
  }


}
