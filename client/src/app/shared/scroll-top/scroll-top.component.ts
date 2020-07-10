import { Component, OnInit, AfterViewInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {fromEvent} from "rxjs";
import { tap, share } from 'rxjs/operators';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
    selector: 'app-scroll-top',
    templateUrl: 'scroll-top.component.html',
    styleUrls: ['scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit, AfterViewInit {


    myWindowScrolled: boolean;

    constructor(
        @Inject(DOCUMENT)
        private myDocument: Document,
        private myScrollService: ScrollService,
    ) { }

    ngOnInit(): void {
        this.myScrollService.scrollOffsetInServiceObservable
            .subscribe(
                (scrollOffsetWeGot) => {
                    console.log('OnInit. Scroll Offset (of the moment) be: ', scrollOffsetWeGot);
                    this.showToTopIfScrolled(scrollOffsetWeGot);
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

}

    ngAfterViewInit() {

        // Not gonna work:
        const myWindowScrollObservable$ = fromEvent(window, 'scroll');

        // Hmm. Not seeming to work :o(
        const myRealScrollObservable$ = fromEvent(document.querySelector('mat-sidenav-content'), 'scroll')
            .pipe(
                tap(
                    (whatIGot) => {
                        console.log('whatIGot scroll pipe tap ', whatIGot);
                    }
                ),
                share()
            );

        console.log('YYY myWindowScrollObservable$ ', myWindowScrollObservable$);
        console.log('ZZZ myRealScrollObservable$ ', myRealScrollObservable$);
    }


    @HostListener("window:scroll", [])
/* Nope:
    @HostListener("document.querySelector('mat-sidenav-content'):scroll", [])
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

        console.log('ZZ myOnWindowScroll()');

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
