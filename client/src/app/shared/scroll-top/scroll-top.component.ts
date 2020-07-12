import { Component, OnInit, AfterViewInit, Inject, HostListener, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {fromEvent} from "rxjs";
import { tap, share } from 'rxjs/operators';
import { ScrollService } from '../../core/services/scroll.service';
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";


@Component({
    selector: 'app-scroll-top',
    templateUrl: 'scroll-top.component.html',
    styleUrls: ['scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit, AfterViewInit {


    myWindowScrolled: boolean;
    scrollOffsetWeJustGotToDisplay: number;
    scrollPositionRounded: number;

    constructor(
        @Inject(DOCUMENT)
        private myDocument: Document,
        private myScrollService: ScrollService,
        private myScrollDispatcher: ScrollDispatcher,
        private myZone: NgZone,
    ) { }

    ngOnInit(): void {
        this.myScrollService.scrollOffsetInServiceObservable
            .subscribe(
                (scrollOffsetWeGot) => {
                    console.log('OnInit. XX99 Scroll Offset (of the moment) be: ', scrollOffsetWeGot);
                    // this.showToTopIfScrolled(scrollOffsetWeGot);
                }
            )
    } // /ngOnInit()

    showToTopIfScrolled(offsetPassedIn) {

        console.log('ZZ99 showToTopIfScrolled(offsetPassedIn) ', offsetPassedIn);

        if ( offsetPassedIn > 100 ) {
            console.log('AA99 .offsetPassedIn > 100 - windowScrolled TRUE! ');
            this.myWindowScrolled = true;
            console.log('AA99 this.myWindowScrolled should be TRUE: ', this.myWindowScrolled);
        } else if (
            this.myWindowScrolled
            &&
            offsetPassedIn < 10 ) {
            console.log('BB99 .offsetPassedIn < 10 - windowScrolled FALSE! ');
            this.myWindowScrolled = false;
            console.log('BB99 this.myWindowScrolled should be FALSE: ', this.myWindowScrolled);
        }

    } // /showToTopIfScrolled()

    ngAfterViewInit() {
        /* NEW
        https://stackoverflow.com/questions/46996191/how-to-detect-scroll-events-in-mat-sidenav-container
        https://material.angular.io/cdk/scrolling/api
         */
        this.myScrollDispatcher.scrolled(100) // auditTimeInMs
            .subscribe(
                (cdkScrollDataWeGot: CdkScrollable) => {
                    this.myZone.run(
                        () => {
                            // console.log('? zone anything? ', anything); // undefined. Okay.
                            const scrollPosition = cdkScrollDataWeGot.getElementRef().nativeElement.scrollTop; // undefined for 'cdkScrollDataWeGot' :o(
                            console.log('999 YOWZA? scrollPosition ', scrollPosition); // e.g.,  996.7999877929688
                            this.scrollOffsetWeJustGotToDisplay = scrollPosition; // TODONE THROTTLE !!! :) << auditTimeInMs. easy-peasy.

                            // DO MATH ROUNDING BIT HERE (for now)
                            let scrollOffsetWeJustGotToDisplayRounded = Math.round(this.scrollOffsetWeJustGotToDisplay); // hmm
                            // this.scrollOffsetWeJustGotToDisplay = Math.round(this.scrollOffsetWeJustGotToDisplay); // whamma-self-jamma ? yeah

                            console.log('scrollOffsetWeJustGotToDisplayRounded ', scrollOffsetWeJustGotToDisplayRounded);

                            this.scrollPositionRounded = Math.round(scrollPosition);
                            console.log('YYY this.scrollPositionRounded ', this.scrollPositionRounded);

                            this.showToTopIfScrolled(this.scrollPositionRounded);
                            // this.showToTopIfScrolled(scrollOffsetWeJustGotToDisplayRounded); // << ?? hmm buggy-ish? shows non-rounded numbers ??
                            // this.showToTopIfScrolled(scrollPosition); // << ?? Acid Test, peu-t'etre? And YES (whoa) (OUI), it worked.
                        }
                    )
                }
            )
    }

    ngAfterViewInitOLD() {
        /* OLD
        https://netbasal.com/reactive-sticky-header-in-angular-12dbffb3f1d3
        https://gist.github.com/zetsnotdead/08cc5632f3427d41254068d322807c51#file-ng-reactive-sticky-header-final-ts
         */

        /* Not gonna work:
        WITH 'FULLSCREEN' (over on app.component.html <mat-sidenav-container>)
        (with Angular Material Design mat-sidenav-content,
        we do not "see" window, body, document, viz. scroll event.)

        Hmm, WITHOUT 'FULLSCREEN' ???
         */
        const myWindowScrollObservable$ = fromEvent(window, 'scroll')
            .pipe(
                tap(
                    (whatIGot) => {
                        console.log('ZZZ "WINDOW" whatIGot scroll pipe tap ', whatIGot);
                        // "Mai visto."
                    }
                ),
                share()
            );


        // Hmm. Not working. :o(
        const myRealScrollObservable$ = fromEvent(document.querySelector('mat-sidenav-content'), 'scroll')
            .pipe(
                tap(
                    (whatIGot) => {
                        console.log('ZZZ "REAL" whatIGot scroll pipe tap ', whatIGot);
                        // "Mai visto."
                    }
                ),
                share()
            );

        // console.log('YYY myWindowScrollObservable$ ', myWindowScrollObservable$); // << Nope
        console.log('ZZZ myRealScrollObservable$ ', myRealScrollObservable$);
    }

/*
******* !!!! *******
Hmm turned OFF the HostListener for window scroll events. Seems that the CDK Scroll thing is doing the job instead = h'rrah ("Seems!") T.B.D.
 ********* !!! ********
*/
    // @HostListener("window:scroll", []) // okay, compiles, but "hears" nothing
    // @HostListener("document:scroll", []) // okay, compiles, but "hears" nothing
    // @HostListener("myDocument:scroll", []) // error, not okay
/* Nope: error, not okay (with or without 'fullscreen') */
    // @HostListener("document.querySelector('mat-sidenav-content'):scroll", [])
    /* Hmm, "@HostListener" jazz/biz
    *****************************************************
    With <mat-sidenav-container fullscreen>, window/document/body "hear" nothing.
    But with 'fullscreen' removed, they *do* hear scroll events. (sheesh)
    ******************************************************
     */
    /*
    Error: Unexpected global target 'document.querySelector('mat-sidenav-content')' defined for 'scroll' event.
        Supported list of global targets: window,document,body.
     */
    myOnWindowScroll() {
        /*
        Hmm, apparently the events from all that "Host Listening" are sent?triggered?provided-to? this
        method of mine, immediately below
        the "@HostListener()" biz. Hmm.
         */
        /* Two examples, kids:
        https://stackblitz.com/github/kwhjvdkamp/scroll-to-top-and-scroll-to-bttom?file=src%2Fapp%2Fscroll-top%2Fscroll-top.component.ts
        https://stackblitz.com/edit/angular-scrolling-goto-top?file=app%2Fapp.component.ts
         */

        console.log('ZZZZ SCROLL-TOP.COMPONENT myOnWindowScroll()');

        if (
/*
            window.pageYOffset
            ||
            document.documentElement.scrollTop
            ||
            document.body.scrollTop
            ||
*/
            // THIS IS ***NOT*** SEEN   sigh
            document.querySelector('mat-sidenav-content').scrollTop
            > 100
        ) {
            console.log('1111 MATSIDENAV !!!! AA .scrollTop > 100 - windowScrolled TRUE! ');
        }


            if (
            window.pageYOffset
            ||
            document.documentElement.scrollTop
            ||
            document.body.scrollTop
            ||
            document.querySelector('mat-sidenav-content').scrollTop
            > 100
        ) {
            console.log('AA .scrollTop > 100 - windowScrolled TRUE! ');
            this.myWindowScrolled = true;
        } else if (
            this.myWindowScrolled
            &&
            window.pageYOffset
            ||
            document.documentElement.scrollTop
            || document.body.scrollTop
            ||
            document.querySelector('mat-sidenav-content').scrollTop
            < 10
        ) {
            console.log('BB .scrollTop < 10 - windowScrolled FALSE! ');
            this.myWindowScrolled = false;
        }

    }

    myScrollToTop() {
        console.log('00 myScrollToTop()');
        (function smoothScroll() {
            console.log('01 (smoothScroll(){})()');
/*
            let currentScrollORIG =
                document.documentElement.scrollTop
                || document.body.scrollTop || document.querySelector('mat-sidenav-content').scrollTop;
*/
            let currentScroll =
                                 document.querySelector('mat-sidenav-content').scrollTop;
            console.log('02 currentScroll ', currentScroll);

           // console.log(`scroll-top.component----|-window.pageYOffset (this.windowScrolled): ${(Math.round(window.pageYOffset*10^2)/10^2)}-xxxxxxx---![CLICKED-UP]!`);

            if (currentScroll > 0) {

                window.requestAnimationFrame(smoothScroll);
                /* Yes:
                document.querySelector('mat-sidenav-content').scrollTo(
                    0,
                    0,
                );
                */
                                document.querySelector('mat-sidenav-content').scrollTo(0,
                                    currentScroll -
                                    (currentScroll / 8)
                                );
            }
        })();


            /* Frank goodness:
    document.querySelector('mat-sidenav-content').scrollTop = 1500;
    https://github.com/angular/components/issues/11552
     */

    } // /myScrollToTop()

    hisScrollToTop() {
        (function smoothScroll() {
            let currentScroll =
                document.documentElement.scrollTop
                || document.body.scrollTop;

            // console.log(`scroll-top.component----|-window.pageYOffset (this.windowScrolled): ${(Math.round(window.pageYOffset*10^2)/10^2)}-xxxxxxx---![CLICKED-UP]!`);

            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothScroll);
                window.scrollTo(0,
                    currentScroll -
                    (currentScroll / 8)
                );
            }
        })();
    } // /hisScrollToTop()
}
