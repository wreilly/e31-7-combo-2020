import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common'; // Kind of subset of BrowserModule (as I understand it; hmm)
// yep: https://guide.freecodecamp.org/angular/ngmodules/

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

/* CRAP
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
*/

import { MyMaterialModule } from '../my-material.module';
import { InputFocusDirective } from './input-focus/input-focus.directive';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';

@NgModule({
    declarations: [
        InputFocusDirective,
        ScrollTopComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        // NgxPageScrollCoreModule, // << CRAP
        // NgxPageScrollModule,
        MyMaterialModule,
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        // NgxPageScrollCoreModule, // << CRAP
        // NgxPageScrollModule,
        MyMaterialModule,
        InputFocusDirective,
        ScrollTopComponent,
    ],
    providers: [

    ],
})
export class SharedModule { }
