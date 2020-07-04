import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import { MatInputModule } from '@angular/material/input';

const myMaterialModulesImported = [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    // MatFormFieldModule, // Not needed ?
    /*
    "MatFormFieldModule is included in MatInputModule, so you don't need to import it again"
    https://stackoverflow.com/questions/50328751/angular-6-error-show-to-mat-form-field-is-not-a-known-element
     */
];

@NgModule({
    declarations: [

    ],
    imports: [

    ],
    exports: [
        ...myMaterialModulesImported
    ],
    providers: [

    ],
})
export class MyMaterialModule {

}
