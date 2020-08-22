import { NgModule } from '@angular/core';

import { ThemeService } from './services/theme.service';
import { ScrollService } from './services/scroll.service';
import { DateService } from './services/date.service';

@NgModule({
    imports: [

    ],
    exports: [

    ],
    declarations: [

    ],
    providers: [
        ThemeService,
        ScrollService,
        DateService,
    ],
})
export class CoreModule { }
