import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, NgZone } from '@angular/core';

import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";



// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "../../core/services/theme.service";
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

    isThemeDarkInComponent: boolean;
    scrollOffsetWeJustGotToDisplay: number;

  @Output('myToggleMatSidenavEventEmitterHeaderName') myToggleMatSidenavEventEmitterHeader: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  myIsMatSidenavOpenFromParentApp: boolean;

    constructor(
      private myThemeService: ThemeService,
      private myScrollService: ScrollService,
      private myScrollDispatcher: ScrollDispatcher,
      private myZone: NgZone,
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

    ngAfterViewInit() {
        /* NEW   FROM SCROLL-TOP.COMPONENT. Kinda crazy to run there, and here.
        https://stackoverflow.com/questions/46996191/how-to-detect-scroll-events-in-mat-sidenav-container
         */
        this.myScrollDispatcher.scrolled()
            .subscribe(
                (cdkScrollDataWeGot: CdkScrollable) => {
                    this.myZone.run(
                        (anything) => {
                            console.log('? zone anything? ', anything);
                            const scrollPosition = cdkScrollDataWeGot.getElementRef().nativeElement.scrollTop; // undefined for 'cdkScrollDataWeGot' :o(
                            console.log('999888 HEADER YOWZA? scrollPosition ', scrollPosition);
                            this.scrollOffsetWeJustGotToDisplay = scrollPosition; // whamma-jamma?
                        }
                    )
                }
            )
    }



    onThemeChange(checkedOrNot: boolean) {
      this.myThemeService.setThemeToggle(checkedOrNot);
    }

    myToggleMatSidenavHeader() {
        this.myToggleMatSidenavEventEmitterHeader.emit(null); // ? null o well
    }

}
