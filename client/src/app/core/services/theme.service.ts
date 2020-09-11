import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import * as fromUI from '../../shared/store/ui.actions';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/

@Injectable({
    providedIn: "root", // as before, don't entirely understand
})
export class ThemeService {
    // Trying NgRx Store now!

    myDarkThemeStoreInService$: Observable<boolean>;

    constructor(
        private myStore: Store,
    ) { }

    myOwnInitForService() {
        // As seen in DebugDevelService, for Show/Hide Component Labels
        // https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
        this.myDarkThemeStoreInService$ = this.myStore.select(fromRoot.getThemeDark);

    }



    // *** 01 ***
    /* WORKS: DARK as default */
    // private _isThemeDarkInServiceBehaviorSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // << Try DEFAULT to "DARK-THEME" y not.

    /* WORKS: LIGHT as default */
    private _isThemeDarkInServiceSubject$: Subject<boolean> = new Subject<boolean>();


    // *** 02 ***
    /* WORKS: DARK as default */
    // public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceBehaviorSubject$.asObservable();

    /* WORKS: LIGHT as default */
    public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceSubject$.asObservable();


    setThemeToggle (whatItIsDarkOrNot: boolean) {

        this.myStore.dispatch(new fromUI.ToggleTheme());

        // *** 03 ***
        /* WORKS: DARK as default */
        // this._isThemeDarkInServiceBehaviorSubject$.next(whatItIsDarkOrNot);

        /* WORKS: LIGHT as default */
        // this._isThemeDarkInServiceSubject$.next(whatItIsDarkOrNot);

    }

}


@Injectable()
export class ThemeServiceSubjectBehaviorSubjectNotNgRx {  // <<< NOT CALLED

    /* Worked, but, not perfectly. Can live with it (for now)
    - Trying to make DARK the default - ok
    - But takes 2 clicks now (not one) to toggle to Light Theme
    - After that, all toggling works okay. Okay.
    - TODO (maybe. probably.) Fix, or put back to Default as Light.
    - To put back: just change these 3 lines below - nothing anywhere else
    cheers. 2020-08-31
     */

    // *** 01 ***
    /* WORKS: DARK as default */
    // private _isThemeDarkInServiceBehaviorSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // << Try DEFAULT to "DARK-THEME" y not.

    /* WORKS: LIGHT as default */
    private _isThemeDarkInServiceSubject$: Subject<boolean> = new Subject<boolean>();


    // *** 02 ***
    /* WORKS: DARK as default */
    // public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceBehaviorSubject$.asObservable();

    /* WORKS: LIGHT as default */
    public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceSubject$.asObservable();


    setThemeToggle (whatItIsDarkOrNot: boolean) {

        // *** 03 ***
        /* WORKS: DARK as default */
        // this._isThemeDarkInServiceBehaviorSubject$.next(whatItIsDarkOrNot);

        /* WORKS: LIGHT as default */
        this._isThemeDarkInServiceSubject$.next(whatItIsDarkOrNot);

    }

} // /ThemeServiceSubjectBehaviorSubjectNotNgRx() // << NOT CALLED
