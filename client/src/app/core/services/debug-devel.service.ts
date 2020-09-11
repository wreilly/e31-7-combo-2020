import { Injectable } from '@angular/core';

/* USE CASE for this whacky Service

Principal (only, ever?) use here:
- Show or Hide, for benefit of developer developing, debugger debugging,
   the "Component Labels" I invented to plunk atop each Component,
   to show barebones skeletal info on U/I.
   Ugly, but, helpful.

   U/I click to show or hide, on the f-l-y. Supah.
 */

import { Store } from '@ngrx/store';
import * as fromUI from '../../shared/store/ui.actions'; // dispatch for sure
import * as fromRoot from '../../store/app.reducer';
import {Observable} from "rxjs"; // select too? prob.


@Injectable({
    providedIn: "root", // as before, don't entirely understand
})
export class DebugDevelService {

    myShowLabelsStoreInService$: Observable<boolean>;

    constructor(
        private myStoreInService: Store,
    ) { }

    myOwnInitForService() {
        /* ngOnInit() ? NO. Not for Service

        https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
        Give this a go: << Working!
        "@Thom - you can add a regular public init() method on your service, import the service and call it from your AppComponent's ngOnInit() – Joe Hanink Oct 28 '19 "

        Alternative notions: (Same SO page)
        "for services you can do initialization in the constructor, or better make init method and call it from the constructor"
        "use the constructor to initialize ..."

         */

        this.myShowLabelsStoreInService$ = this.myStoreInService.select(fromRoot.getShowLabels);
    } // /myOwnInitForService()

    onLabelShowHideChangeInService(checkedOrNot: boolean) {
        console.log('this.onLabelShowHideChange - checkedOrNot ', checkedOrNot);
        /* Yeah. true false checked or cleared checkbox. ok.
         */

        this.myStoreInService.dispatch(new fromUI.ToggleShowLabels()); // << Thus far, still no payload

        let localShowLabelInService: boolean;

        this.myShowLabelsStoreInService$.subscribe(
            (whatWeGetSubscribeInService) => {
                console.log('whatWeGetSubscribeInService ', whatWeGetSubscribeInService);  // e.g. false, true
                localShowLabelInService = whatWeGetSubscribeInService;
            }
        )

        if (localShowLabelInService) { // DO SHOW Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'inline')
        } else if (!localShowLabelInService) { // HIDE Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'none')
        }
    } // onLabelShowHideChangeInService()

}
