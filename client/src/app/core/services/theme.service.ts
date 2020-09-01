import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/

@Injectable()
export class ThemeService {

    /* KINDA FAILED, but can live with it (for now)
    - Trying to make DARK the default - ok
    - But takes 2 clicks now (not one) to toggle to Light Theme
    - After that, all toggling works okay. Okay.
    - TODO (maybe. probably.) Fix, or put back to Default as Light.
    - To put back: just change these 3 lines below - nothing anywhere else
    cheers. 2020-08-31
     */

    private _isThemeDarkInServiceBehaviorSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // << Try DEFAULT to "DARK-THEME" y not.
/* WORKS:
    private _isThemeDarkInServiceSubject$: Subject<boolean> = new Subject<boolean>();
*/

    public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceBehaviorSubject$.asObservable();
/* WORKS:
    public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceSubject$.asObservable();
*/

    setThemeToggle (whatItIsDarkOrNot: boolean) {
        this._isThemeDarkInServiceBehaviorSubject$.next(whatItIsDarkOrNot);
/* WORKS:
        this._isThemeDarkInServiceSubject$.next(whatItIsDarkOrNot);
*/
    }

}
