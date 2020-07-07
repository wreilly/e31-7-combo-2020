import * as fromUIActions from './ui.actions';

export interface MyState {
    sidenavIsOpen: boolean;
    // TODO isLoading: boolean, too
}

const myInitialState: MyState = {
    sidenavIsOpen: false,
    // sidenavIsOpen: true,
}

export function UIReducer(
    state: MyState = myInitialState,
    action: fromUIActions.UIActions,
): MyState {

    console.log('state: MyState in UIReducer: ', state);
    /*
    {sidenavIsOpen: false}
     */

    let abracadabra = 'ABRACADABRA';
    // above is used for OLDER (unused) CODE below

    switch (action.type) {

        case fromUIActions.SET_SIDENAV_TO_OPPOSITE_STATE:
            // ******************

            // Hey! Much better than the "yucky" pseudo/toggle logic below:
/* ***WORKS***
            return Object.assign({}, state, { sidenavIsOpen: !state.sidenavIsOpen });
*/
            /* source for above:
            https://gist.github.com/btroncone/a6e4347326749f938510
             */

            /* https://scotch.io/bar-talk/copying-objects-in-javascript#toc-the-naive-way-of-copying-objects
            Hmm!!!
            N.B. I am *ignoring* the poorly written # 1 here. Yeesh.
            # 1. "the assignment operator Object.assign() doesn't create a copy of an object, it only assigns a reference to it, " ??
            But:
            # 2. "...with Object.assign() we have successfully created a copy of the source object without any references to it."  << yeah okay
             */

            let myAssignedObjectToReturnState: MyState = {sidenavIsOpen: null};
            /* ?
            I guess we can "set up" this property as null - doesn't really matter.
            Could be set up as true, or false. It's just a placeholder.
            The actual 'state' is going to
            have its own actual value
            (true or false) on the
            state.sidenavIsOpen
             */

/*
            Object.assign(myAssignedObjectToReturnState, state);

            console.log('00 myAssignedObjectToReturnState ', myAssignedObjectToReturnState);
*/
            /* YEP
            {sidenavIsOpen: false}
             */

            Object.assign(myAssignedObjectToReturnState, state, { sidenavIsOpen: !state.sidenavIsOpen });

            console.log('01 myAssignedObjectToReturnState ', myAssignedObjectToReturnState);
            /* YEP
            {sidenavIsOpen: true}
             */

            // console.log('01 JSON.stringify(myAssignedObjectToReturnState)) ', JSON.stringify(myAssignedObjectToReturnState));
            /* YEP
            (Note: no need for stringify() biz. ok)
            {"sidenavIsOpen":true}
             */

            return myAssignedObjectToReturnState;



        // /*****************
            // return state;


        case abracadabra: // << OLDER CODE
            // -ORIG-fromUIActions.SET_SIDENAV_TO_OPPOSITE_STATE
            /*
            This "abracadabra" biz is
            simply a whacked-out way for me to rename and SAVE this OLDER CODE (below)
            It ain't as good. Better code above.
            So, the below DOES WORK
            But the above DOES WORK and is BETTER. Cheers.
             */

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
            /*
            Rationale:
            (May be right, may be "not (quite?) right" etc. Who Knows.)
            - 'state' is an Object, like so:
            {
             sidenavIsOpen: false,
            }
            - We want a COPY of 'state'
            - We do NOT want any "pointer" to 'state'
            - So we NOT want to 'whamma-jamma' assign 'state' onto a new variable. No.
            newState: MyState = state; // << NO
            - We DO want to use something like Object.assign({}, state) << that gets you a COPY, another, new, distinct object.

             */
            const myStateToBeUpdatedACopyObjectViaAssign: MyState = {
                ...state,
                sidenavIsOpen: null
            };
            // huh, who knew that null could work here (for boolean) hmm.

            Object.assign(myStateToBeUpdatedACopyObjectViaAssign, state);
            // /FROM EMAIL-FABRICATOR





            // Yucky if logic
            if (state.sidenavIsOpen === true) {
                console.log('1A-2020 sidenavbiz set to TRUE state ', state);
                console.log('1B-2020 sidenavbiz set to TRUE state.sidenavIsOpen ', state.sidenavIsOpen);
                // state.sidenavIsOpen = false; // ??
                /*
ERROR TypeError: Cannot assign to read only property 'sidenavIsOpen' of object '[object Object]'
 */
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