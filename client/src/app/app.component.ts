import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UIActions from './shared/store/ui.actions';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "./core/services/theme.service";
import {MyState} from "./shared/store/ui.reducer";
// import {MyOverallState} from "./store/app.reducer";
import * as fromRoot from "./store/app.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'clienty-2020';

    public isThemeDarkInAppComponent: boolean; // = false;

    isSidenavOpenInApp$: Observable<boolean>;

    constructor(
        private myThemeService: ThemeService,
        private myStore: Store<fromRoot.MyOverallState>,
    ) {
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

    myTellStoreAboutSidenavToggle() {
        console.log('this.isSidenavOpenInApp$ : ', this.isSidenavOpenInApp$); // Store object ... (!)
        /*
        Store {_isScalar: false, actionsObserver: ActionsSubject, reducerManager: ReducerManager, source: Store, operator: DistinctUntilChangedOperator}
actionsObserver: ActionsSubject { ...
         */

        this.myStore.dispatch(new UIActions.SetSidenavToOppositeState());
    }

}
