import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common'; // Kind of subset of BrowserModule (as I understand it; hmm)
// yep: https://guide.freecodecamp.org/angular/ngmodules/

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from '../my-material.module';
import { InputFocusDirective } from './input-focus/input-focus.directive';

@NgModule({
    declarations: [
        InputFocusDirective
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MyMaterialModule,
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MyMaterialModule,
        InputFocusDirective,
    ],
    providers: [

    ],
})
export class SharedModule { }
