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
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
