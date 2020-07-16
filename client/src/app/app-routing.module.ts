import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WelcomeComponent} from "./welcome/welcome.component";



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
