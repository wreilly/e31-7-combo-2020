import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "../../core/services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isThemeDarkInComponent: boolean;
  @Output('myToggleMatSidenavEventEmitterHeaderName') myToggleMatSidenavEventEmitterHeader: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  myIsMatSidenavOpenFromParentApp: boolean;

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
  } // /ngOnInit()

    onThemeChange(checkedOrNot: boolean) {
      this.myThemeService.setThemeToggle(checkedOrNot);
    }

    myToggleMatSidenavHeader() {
        this.myToggleMatSidenavEventEmitterHeader.emit(null); // ? null o well
    }

}
