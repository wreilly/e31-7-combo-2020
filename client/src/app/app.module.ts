import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// ? Q. Do I need BrowserAnimationsModule ? Seems not yet.
// A. YES. I do.
/*
core.js:6228 ERROR Error: Found the synthetic listener @transform.start. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.
 */
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MyMaterialModule } from './my-material.module';

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
    MyMaterialModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
