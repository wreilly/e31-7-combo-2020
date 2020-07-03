import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";

const myMaterialModulesImported = [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
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
