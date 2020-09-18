import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common'; // Kind of subset of BrowserModule (as I understand it; hmm)
// yep: https://guide.freecodecamp.org/angular/ngmodules/

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* CRAP
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
*/

import { MyMaterialModule } from '../my-material.module';
import { InputFocusDirective } from './input-focus/input-focus.directive';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { CategorizerComponent } from './categorizer/categorizer.component';

import {RouterModule} from "@angular/router"; // << Auto by WebStorm
// CategorizerComponent making use of RouterLink. Needed this line.
// Imported, but not Exported. Okay.

@NgModule({
    declarations: [
        InputFocusDirective,
        ScrollTopComponent,
        PaginatorComponent,
        CategorizerComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule, // << ArticleDetailTwoComponent: template-driven form
        // NgxPageScrollCoreModule, // << CRAP
        // NgxPageScrollModule,
        MyMaterialModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        // NgxPageScrollCoreModule, // << CRAP
        // NgxPageScrollModule,
        MyMaterialModule,
        InputFocusDirective,
        ScrollTopComponent,
        PaginatorComponent,
        CategorizerComponent, // << ng g component did NOT place this line here. Needed it. Interesting. I guess.
    ],
    providers: [

    ],
})
export class SharedModule { }
