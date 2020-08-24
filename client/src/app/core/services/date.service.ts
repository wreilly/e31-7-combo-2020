import { Injectable } from '@angular/core';
// import { moment } from 'moment'; // << ?
// import moment from 'moment'; // << ? "can only be default-imported using the 'allowSyntheticDefaultImports' flag"
import { Moment } from 'moment'; // << ? "TS2693: 'Moment' only refers to a type, but is being used as a value here."
import * as myMoment from 'moment'; // << Try to *not* use the "*" (overload/bloat)
import * as myMomentTs from 'moment/moment'; // << Try to *not* use the "*" (overload/bloat)

@Injectable({
    providedIn: "root",
    /*
    Q. Hmm is this "root" biz here correct ( ? )
    A. Yes. And, you can (should) leave "DateService" *out of* the CoreModule 'providers': []
       I seem to recall this in fact is the preferred way. (I do it also for FilterSortService. cheers.)
       (cf. ScrollService, ThemeService)
     */
})
export class DateService {

    // ***  DATE UTILITIES  **************************************
    // We've npm-installed moment.js (2.27.0) https://momentjs.com/

    // =-=-=-=---=-=-=--=-=-=-==-
    // DATE ** >> FORMATTING << ** Is what this is all about ..... ( I kno - big whoop )
    // =-=-=-=---=-=-=--=-=-=-==-

/*
    2020-08-20        // << Perennial WR__ fave.
    August 20th, 2020 // << Y NOT. My "Formatted". cheers
    August 20, 2020
    Aug 20, 2020      // << Angular pipe: | date
    Thu Aug 20 2020
    Thu Aug 20 2020 18:14:22 GMT-0400 (Eastern Daylight Time) // << FULL
*/


    myMomentFromObjectId = function (objectId): myMoment.Moment {
        return myMoment( new Date(parseInt(objectId.substring(0, 8), 16) * 1000));
    };

    // Yeah okay but not using
    myStringDateFromObjectIdLambdaArrow = (objectId): string => {
        let stringDateToReturn = '';
        this.myDateFromObjectIdFunctionTerm('');
        return stringDateToReturn;
    }

    /* ? older school? Uses   = function () {}  // << Old(er) school. Issues with "this". sigh.
    * {}.bind(this) to the rescue (! ) :o) */
    myStringDateFromObjectIdFunctionTerm = function (objectIdPassedInToService): string {
        let stringDateToReturn = '';
        let dateINeed: Date;
        let momentINeed: Moment;

        dateINeed = this._myDateFromObjectId(objectIdPassedInToService); // << Calling "00" ORIG. :o)
        momentINeed = myMoment(dateINeed);
        // console.log('8888 momentINeed ? ', momentINeed);
        /* _isAMomentObject: true
        Thu Aug 20 2020 18:14:22 GMT-0400 (Eastern Daylight Time)
         */
        stringDateToReturn = momentINeed.format('ddd MMMM Do, YYYY'); // yes. yeesh.  Thu August 20th, 2020
        return stringDateToReturn;

    }.bind(this); // h'rrah
/* */


    // https://steveridout.github.io/mongo-object-time/
    // 00
    /*  ORIG.  Uses   = function () {}  // << Old(er) school. Issues with "this". sigh. */
        private _myDateFromObjectId = function (objectId): Date {
            return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        };
    /* */

    // 01
    myDateFromObjectIdFunctionTerm = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    // 02
    myDateFromObjectIdNoFunctionTerm (objectId: string): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    // 03
    myDateFromObjectIdLambdaArrow = (objectId: string): Date => {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    // =================

    private _myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };

}
