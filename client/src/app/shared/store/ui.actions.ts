import { Action } from '@ngrx/store';

/* *************************
    INTERFACE DEFINITION
   *************************
   Copy here in Actions, from Reducer,
   for *convenience*. cheers.

export interface MyState {
    sidenavIsOpen: boolean;
    isLoading: boolean;
    articleIdIs: string;
    areWeEditing: boolean;
}
 */

export const SET_SIDENAV_TO_OPPOSITE_STATE = '[UI] Set Sidenav To Opposite State';

export const START_LOADING = '[UI] Start Loading';
export const STOP_LOADING = '[UI] Stop Loading';

/*
ArticleDetailComponent (viz. "parent" ArticlesComponent, and <router-outlet> and on-activate())
 */
export const TELLING_YOU_MY_ID = '[UI] Telling You My Id';
export const TELLING_YOU_IF_WE_ARE_EDITING = '[UI] Telling You If We Are We Editing'

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

export class TellingYouMyId implements Action {
    readonly type = TELLING_YOU_MY_ID;

    /*
    O LA
    I had/suffered-from WRONG CONSTRUCTOR SIGNATURE.
    Ouch-y
     */

    constructor(
/* Yeah, simplified I got to work. Okay, but we can do better. see below.
        public myPayload: string, // remove {} object biz.
*/
// Back to "Plan A."
    public myPayload: {
/* Initial understanding:
        // myIdIsInAction: string, // << Q. ? Does name have to match?
        articleIdIs: string, // << A. It sure as hell does!
*/
        myIdIsInAction: string, // << Q. ? Does name have to match? WE SHALL (RE)-SEE!
        // articleIdIs: string, // << A. dunno (YET)
    }

    ) { }
}
/*
NOTE:
// THIS is what the action data looks like:
{
  myPayload: '5af746cea7008520ae732e2c',
  type: '[UI] Telling You My Id'
}

// I guess I thought it was going to be like this instead:
{
  myPayload: { myIdIsInAction: '5af746cea7008520ae732e2c' }, // << N.B.!!!
  type: '[UI] Telling You My Id'
}
 */

export class TellingYouIfWeAreEditing implements Action {
    readonly type = TELLING_YOU_IF_WE_ARE_EDITING;
    constructor(
        public myPayload: {
            areWeEditingInAction: boolean,
        }
    ) {  }
}

export type UIActions =
      SetSidenavToOppositeState
    | StartLoading
    | StopLoading
    | TellingYouMyId
    | TellingYouIfWeAreEditing;

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
