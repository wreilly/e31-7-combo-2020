import * as fromUIActions from './ui.actions';

export interface MyState {
    sidenavIsOpen: boolean;
    // TODO isLoading: boolean, too
}

const myInitialState: MyState = {
    sidenavIsOpen: false,
}

export function UIReducer(
    state: MyState = myInitialState,
    action: fromUIActions.UIActions,
): MyState {

    console.log('state: MyState in UIReducer: ', state);
    /*
    {sidenavIsOpen: false}
     */

    switch (action.type) {

        case fromUIActions.SET_SIDENAV_TO_OPPOSITE_STATE:
            console.log('case fromUIActions.SET_SIDENAV_TO_OPPOSITE_STATE: ');
            // MAKE A **COPY**.  DO NOT MUTATE!
/* *********** OLD. BAD. YUCK.
            let myStateToBeUpdatedACopyObjectViaSpreadOperator: MyState;
            myStateToBeUpdatedACopyObjectViaSpreadOperator = {
                ...state,
                sidenavIsOpen: null, //  curious null ok on boolean hmm
                // sidenavIsOpen: !state.sidenavIsOpen, // ??
            };
            // return myStateToBeUpdatedACopyObjectViaSpreadOperator;

            let my2ndStateToBeUpdatedACopyObjectViaAssign: MyState;
/!* WRONG
            Object.assign(my2ndStateToBeUpdatedACopyObjectViaAssign, state);
*!/
            Object.assign(myStateToBeUpdatedACopyObjectViaSpreadOperator, state);
            ********* /OLD. BAD. YUCK.
*/

            // FROM EMAIL-FABRICATOR:
            const myStateToBeUpdatedACopyObjectViaAssign: MyState = {
                ...state,
                sidenavIsOpen: null
            };
            // huh, who knew that null could work here (for boolean) hmm.

            Object.assign(myStateToBeUpdatedACopyObjectViaAssign, state);
            // /FROM EMAIL-FABRICATOR





            // Yucky if logic
            if (state.sidenavIsOpen === true) {
                // state.sidenavIsOpen = false; // ??
                myStateToBeUpdatedACopyObjectViaAssign.sidenavIsOpen = false;
            } else {
                if (state.sidenavIsOpen === false) {
                    // state.sidenavIsOpen = true; // ??
                    /*
                    ERROR TypeError: Cannot assign to read only property 'sidenavIsOpen' of object '[object Object]'
                     */
                    myStateToBeUpdatedACopyObjectViaAssign.sidenavIsOpen = true;
                }
            }
            return myStateToBeUpdatedACopyObjectViaAssign;

        default:
            return state;
    }
}

export function getIsSidenavOpen(statePassedIn: MyState) {
    console.log('8888 UI Reducer - getIsSidenavOpen() - statePassedIn ', statePassedIn);

    return statePassedIn.sidenavIsOpen;
}

// *****  From OTHER Project  ************************
/* EXAMPLE USE OF .SELECT()
    this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);
    src/app/auth/login/login.component.ts:197
 */
/* EXAMPLE USE OF .DISPATCH()
this.myStore.dispatch(new UI.StartLoading());
src/app/auth/auth.service.ts:255
 */
// *************************************
/*
/Users/william.reilly/dev/Angular/Udemy-AngularMaterial-MaxS/2019/WR__2/fitness-tracker-wr3/src/app/shared/ui.actions.ts
*/
