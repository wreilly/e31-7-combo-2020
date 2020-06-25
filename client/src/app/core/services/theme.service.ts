import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/

@Injectable()
export class ThemeService {

    private _isThemeDarkInServiceSubject$: Subject<boolean> = new Subject<boolean>();
    public isThemeDarkInServiceObservable: Observable<boolean> = this._isThemeDarkInServiceSubject$.asObservable();

    setThemeToggle (whatItIsDarkOrNot: boolean) {
        this._isThemeDarkInServiceSubject$.next(whatItIsDarkOrNot);
    }

}
