/* ! :o)  << ? j'espere !
https://auth0.com/blog/real-world-angular-series-part-3/#L-span-id--angular-filterSort-service----span-Angular--Create-a-Filter-Sort-Service
 */

import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: "root",
})
export class FilterSortService {
    constructor(
        private myDatePipe: DatePipe,
    ) { }

    private _objArrayCheck(array: any[]): boolean {
        // Checks if the first item in the array is an object
        // (assumes same-shape for all array items)
        // Necessary because some arrays passed in may have
        // models that don't match {[key: string]: any}[]
        // This check prevents uncaught reference errors

        const item0 = array[0];
        const check = !!(
            array.length &&
            item0 !== null &&
            Object.prototype.toString.call(item0) === '[object Object]'
        );
        return check;
    }

    /* ! :o) ? j'espere !
    https://github.com/auth0-blog/mean-rsvp-auth0/blob/master/src/app/core/filter-sort.service.ts
     */
    myFilter(arrayPassedIn: any[], propertyPassedIn: string, valuePassedIn: any): any[] {

        if (!propertyPassedIn || valuePassedIn === undefined || !this._objArrayCheck(arrayPassedIn)) {
            return arrayPassedIn;
        }

        const myFilteredArray = arrayPassedIn.filter(
            myItem => {
                for (const myKey in myItem) {
                    if (myItem.hasOwnProperty(myKey)) {
                        if (myKey === propertyPassedIn && myItem[myKey] === valuePassedIn) {
                            return true;
                        }
                    }
                }
            }
        );

        return myFilteredArray;
    }

}
