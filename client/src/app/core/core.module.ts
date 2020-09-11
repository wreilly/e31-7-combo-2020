import { NgModule } from '@angular/core';

import { ThemeService } from './services/theme.service';
import { ScrollService } from './services/scroll.service';
import {DatePipe} from "@angular/common";
/*
https://auth0.com/blog/real-world-angular-series-part-3/#L-span-id--angular-filterSort-service----span-Angular--Create-a-Filter-Sort-Service
 */

// import { DateService } from './services/date.service';
// import { FilterSortService } from './services/filter-sort.service';
import { DebugDevelService } from './services/debug-devel.service';

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
        // DateService,
        // FilterSortService,
        DatePipe,
        DebugDevelService,
    ],
})
export class CoreModule { }
