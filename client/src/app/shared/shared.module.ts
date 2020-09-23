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
import { CategorizerTwoComponent } from './categorizer-two/categorizer-two.component';

import {RouterModule} from "@angular/router"; // << Auto by WebStorm
// CategorizerComponent making use of RouterLink. Needed this line.
// Imported, but not Exported. Okay.

@NgModule({
    declarations: [
        InputFocusDirective,
        ScrollTopComponent,
        PaginatorComponent,
        CategorizerComponent,
        CategorizerTwoComponent,
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
        CategorizerComponent,
        CategorizerTwoComponent,
        // << ng g component did NOT place this line here. Needed it. Interesting. I guess.
        /* bit odd. upon ng g component for CategorizerTwoComponent, at first,
        WebStorm IDE *did* complain it "was in no Angular module"
        After short bit, close, re-open file, IDE complaint just went away. Hmm.
        Ergo, I have *not* added CategorizerTwoComponent to this exports: [] array. cheers.
        (Not going away though for my same time ng g component for ArticlesCategorizedTwoComponent.
        what the hay.)
         */
    ],
    providers: [

    ],
})
export class SharedModule { }
