import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { Store } from '@ngrx/store';
import * as UIActions from './shared/store/ui.actions';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "./core/services/theme.service";
import {MyState} from "./shared/store/ui.reducer";
// import {MyOverallState} from "./store/app.reducer";
import * as fromRoot from "./store/app.reducer";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";
import {ScrollService} from "./core/services/scroll.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public isThemeDarkInAppComponent: boolean; // = false;

    isSidenavOpenInApp$: Observable<boolean>;

    lastOffset: number; // Scroll biz
    scrollingSubscription: Subscription;

    constructor(
        private myThemeService: ThemeService,
        private myStore: Store<fromRoot.MyOverallState>,
        public scroll: ScrollDispatcher,
        private myScrollService: ScrollService,
    ) {
        /* re: above scroll biz
        https://stackoverflow.com/questions/47528852/angular-material-sidenav-cdkscrollable/50812763#50812763
         */
        // DEBUGGING! (from email-fabricator)
        // This code does nothing; just exploring how to get at value in Observable.
        /* Boo hiss
        ERROR TypeError: Cannot read property 'sidenavIsOpen' of undefined
         */
        myStore.select(stateWeGot => stateWeGot.uiPartOfStore.sidenavIsOpen).subscribe(stateWeGotNested => {
            console.log('03 constructor. stateWeGotNested ', stateWeGotNested); // Yes false / true
        });
        /*
        Above emulates AppComponent code in:
        https://medium.com/@holtkam2/angular-ngrx-store-understanding-the-data-flow-28566a2d6b4b
         */

        // SCROLL BIZ (see URL up above)
        this.scrollingSubscription = this.scroll
            .scrolled()
            .subscribe(
                (dataWeGot: CdkScrollable) => {
                    console.log('APP CdkStrollable dataWeGot');
                    console.log('APP CdkStrollable dataWeGot ? ', dataWeGot);
                   // this.myNOLONGERHEREOnWindowScroll(dataWeGot) // << Yes!
                    // this.myScrollService.myOnWindowScroll(dataWeGot)
                }
            )

    } // /constructor()

    ngOnInit(): void {

        this.myThemeService.isThemeDarkInServiceObservable
            .subscribe(
                (whatIGot) => {
                    console.log('OnInit. ThemeDark subscribe whatIGot: boolean - ', whatIGot);
                    this.isThemeDarkInAppComponent = whatIGot;
                }
            );

        // TRY 03 ? << YES WORKS :o)
        this.isSidenavOpenInApp$ = this.myStore.select(fromRoot.getIsSidenavOpen);


        // TRY 02 ? << YES WORKS
/*
        this.isSidenavOpenInApp$ = this.myStore.select(
            stateWeGot => stateWeGot.uiPartOfStore.sidenavIsOpen
            );
*/
        /* Boo hiss
        ERROR TypeError: Cannot read property 'sidenavIsOpen' of undefined
         */

/* TRY 01 No ? (cf. email-fabricator...)
        this.isSidenavOpenInApp$ = this.myStore.select(
            fromRoot.getIsSidenavOpen
        );
*/
        // This function returns Observable<boolean>, not just boolean.

/* NO:
        this.isSidenavOpenInApp$ = this.myStore.select(
            (overallStateIGot: fromRoot.MyOverallState): boolean => {
                // This function returns Observable<boolean>, not just boolean.
                // console.log('onInit. Store. overallStateIGot: ', overallStateIGot.uiPartOfStore.sidenavIsOpen);
                console.log('onInit. Store. overallStateIGot: ', overallStateIGot);
                /!*
                { uiPartOfStore:
                  { sidenavIsOpen: true }
                 }
                 *!/
                return overallStateIGot.uiPartOfStore.sidenavIsOpen; // << NOPE.
                // Hmm, above is undefined ('uiPartOfStore'). sigh.
                // true; // TODONE don't forget it is HARD-CODED crazy man
            }
        );
*/
        /*
        this.isSidenavOpenInApp$ = this.myStore.select();
                                                       ~~~~~~~~
      node_modules/@ngrx/store/src/store.d.ts:12:15
        12     select<K>(mapFn: (state: T) => K): Observable<K>;
                         ~~~~~~~~~~~~~~~~~~~~~~
        An argument for 'mapFn' was not provided.
         */

    } // /ngOnInit()

    // NOW INSTEAD SEE CORE / SERVICE / SCROLL ... ...
    myNOLONGERHEREOnWindowScroll(scrollData: CdkScrollable) {
        // noinspection DuplicatedCode
        const myScrollTop = scrollData.getElementRef().nativeElement.scrollTop || 0;
        /*
        <mat-sidenav-container fullscreen> => Yes
        <mat-sidenav-container           > => No. "scrollData" undefined.
         */

        console.log('APP - myNOLONGERHEREOnWindowScroll - Scroll biz myScrollTop ', myScrollTop);
        /* E.g.,
        0, 278.66666453647, 280, 10994  etc.
         */

        console.log('Scroll biz scrollData ', scrollData);
        /*
        CdkScrollable {elementRef: ElementRef, scrollDispatcher: ScrollDispatcher, ngZone: NgZone, dir: Directionality, _destroyed: Subject, …}
         */

        console.log('Scroll biz scrollData.getElementRef() ', scrollData.getElementRef());
        /*
ElementRef {nativeElement: mat-sidenav-content.mat-drawer-content.mat-sidenav-content}
         */

        console.log('Scroll biz scrollData.getElementRef() ', scrollData.getElementRef().nativeElement.nodeName);
        /*
        MAT-SIDENAV-CONTENT
         */

        if (this.lastOffset > myScrollTop) {
            console.log('Show toolbar');
        } else if (myScrollTop < 10) {
            console.log('Show toolbar');
        } else if (myScrollTop > 100) {
            console.log('Hide toolbar');
        }

        this.lastOffset = myScrollTop;
    }

    myTellStoreAboutSidenavToggle() {
        console.log('this.isSidenavOpenInApp$ : ', this.isSidenavOpenInApp$); // Store object ... (!)
        /*
        Store {_isScalar: false, actionsObserver: ActionsSubject, reducerManager: ReducerManager, source: Store, operator: DistinctUntilChangedOperator}
actionsObserver: ActionsSubject { ...
         */

        this.myStore.dispatch(new UIActions.SetSidenavToOppositeState());
    }

    ngOnDestroy(): void {
        if(this.scrollingSubscription) {
            this.scrollingSubscription.unsubscribe();
        }
    }

}
