import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const myMaterialModulesImported = [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
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
