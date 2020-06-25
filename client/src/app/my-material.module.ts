import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';


const myMaterialModulesImported = [
    MatSidenavModule,
    MatButtonModule,
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
