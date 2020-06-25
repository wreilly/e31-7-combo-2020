import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// ? Q. Do I need BrowserAnimationsModule ? Seems not yet.
// A. YES. I do. (Though, for fun, will try the "Noop" version for awhile y not.)
/*
core.js:6228 ERROR Error: Found the synthetic listener @transform.start. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.
 */
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';

// import { MyMaterialModule } from './my-material.module'; // << Now in SharedModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    SharedModule,
    // MyMaterialModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
