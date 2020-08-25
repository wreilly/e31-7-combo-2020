import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import {WelcomeComponent} from "./welcome/welcome.component";

const myRouterOptions: ExtraOptions = {
    /* TRYING TO FIX https://0.0.0.0:4200/#top-XYZ-anchor (e.g. 'header' or 'welcome' etc)
    ArticleAddComponent .letUsCancelEditing() .navigate() ...

    SEEMS TO BE WORKING :)

    https://stackoverflow.com/questions/54574986/angular-7-x-x-easiest-way-to-scroll-to-a-fragment
     */
    anchorScrolling: "enabled",
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled',


    // *** OLDER NOTES ***
    // useHash: true, // hmm. yields /#/ on end of my URLs. me no likey.
/* No, not in the end using
    scrollPositionRestoration: 'enabled',
    anchorScrolling: "enabled",
*/
    //onSameUrlNavigation: 'reload', ??
}
/* https://www.geekstrick.com/fragment-url-in-angular-8/#Set_Options_forRoot
   scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],

    re: scrollOffset
    https://stackoverflow.com/questions/57978281/angular-8-app-when-using-fragment-is-overlapping-with-header

Also mebbe?
// { onSameUrlNavigation: 'reload'}

More crap on above
https://www.bennadel.com/blog/3545-enabling-the-second-click-of-a-routerlink-fragment-using-onsameurlnavigation-reload-in-angular-7-1-3.htm
 */



const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: WelcomeComponent,
  },
];

@NgModule({
  imports: [
      RouterModule.forRoot(
          routes,
          // { onSameUrlNavigation: 'reload'}
          myRouterOptions, // << Seems to now be working
          // for TRYING TO FIX https://0.0.0.0:4200/#top-XYZ-anchor Bene.
      ),
/* Above, hmm, on its own, did NOT do "the trick"
https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
 */
      /* Note: If wondering what DID do the trick, this is it:
      src/app/articles/articles.component.ts:29
      constructor() {
          this.myRouter.routeReuseStrategy.shouldReuseRoute = () => false;
          }

Notes, Sources:
    f'ing "@Pascal'
    https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
    MUCH better Comment:  Thanks, "@AC"
    https://nativescript.org/blog/how-to-extend-custom-router-reuse-strategy/
    "add the [above] to the constructor of a ***specific component***" << "ah-hah" moment. sheesh.
     */

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
