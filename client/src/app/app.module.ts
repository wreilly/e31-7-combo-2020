import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/* ? Q. Do I need BrowserAnimationsModule, with/for Material Design ? Seems not yet.
     A. YES. I do. (Though, for fun, will try the "Noop" version for awhile y not.)
     OK: Now I see examples of Where Needed (!).
     - The MatSlideToggle moves too quickly with Noop.
     - Click a button, no ripple etc.
          - The click on a text link is too quick too. << hmm, unchanged ?
 */
/*
core.js:6228 ERROR Error: Found the synthetic listener @transform.start. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.
 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
// import { MyMaterialModule } from './my-material.module'; // << Now in SharedModule

import { StoreModule } from '@ngrx/store';
// TODO store-devtools ...
import * as fromRoot from './store/app.reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomeComponent,
    FooterComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    SharedModule,
    CoreModule,
    // MyMaterialModule,
    StoreModule.forRoot(fromRoot.myRootReducersMap),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
