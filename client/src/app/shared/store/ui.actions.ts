import { Action } from '@ngrx/store';

export const SET_SIDENAV_TO_OPPOSITE_STATE = '[UI] Set Sidenav To Opposite State';

export const START_LOADING = '[UI] Start Loading';
export const STOP_LOADING = '[UI] Stop Loading';

export class SetSidenavToOppositeState implements Action {
    readonly type = SET_SIDENAV_TO_OPPOSITE_STATE;
    // No payload
    constructor() { }
}

export class StartLoading implements Action {
    readonly type = START_LOADING;
    // No payload
    constructor() {
    }
}

export class StopLoading implements Action {
    readonly type = STOP_LOADING;
    // No payload
    constructor() {
    }
}

export type UIActions =
    SetSidenavToOppositeState
    | StartLoading
    | StopLoading;

// *****  Bit of Cheatsheet. From OTHER Project  ************************
/* EXAMPLE USE OF .SELECT()
    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);
    src/app/auth/login/login.component.ts:197 (ngOnInit())
 */
/* EXAMPLE USE OF .DISPATCH()
this.myStore.dispatch(new UI.StartLoading());
src/app/auth/auth.service.ts:255
 */
// *************************************
/*
/Users/william.reilly/dev/Angular/Udemy-AngularMaterial-MaxS/2019/WR__2/fitness-tracker-wr3/src/app/shared/ui.actions.ts
*/
