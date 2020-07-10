import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "../../core/services/theme.service";
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isThemeDarkInComponent: boolean;
    scrollOffsetWeJustGotToDisplay: number;

  @Output('myToggleMatSidenavEventEmitterHeaderName') myToggleMatSidenavEventEmitterHeader: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  myIsMatSidenavOpenFromParentApp: boolean;

    constructor(
      private myThemeService: ThemeService,
      private myScrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.myThemeService.isThemeDarkInServiceObservable
        .subscribe(
            (whatIGot) => {
              console.log('OnInit. ThemeDark subscribe whatIGot: boolean - ', whatIGot);
              this.isThemeDarkInComponent = whatIGot;
            }
        )


      this.myScrollService.scrollOffsetInServiceObservable
          .subscribe(
              (scrollOffsetWeGot) => {
                  console.log('HEADER 00 OnInit. Scroll Offset (of the moment) be: ', scrollOffsetWeGot);
                  this.scrollOffsetWeJustGotToDisplay = scrollOffsetWeGot;
                  console.log('HEADER 01 OnInit. this.scrollOffsetWeJustGotToDisplay ', this.scrollOffsetWeJustGotToDisplay);
                  // this.showToTopIfScrolled(scrollOffsetWeGot);
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
