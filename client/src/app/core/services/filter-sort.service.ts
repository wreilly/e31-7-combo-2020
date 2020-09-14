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
        /* N.B. See Also: mySpecialFilter()
                regarding the "No Category Assigned" button on the U/I.
                Thanks.
         */

        /* Q. WHAT DO I PASS IN?
        A.
        1. ALL the Articles, in an Array
        2. Property (to be compared, filtered on) is this string: 'articleCategory_name'
        3. Value (to be compared, filtered on) is: categoryStoredValuePassedIn
        (NOTE: This is the *ViewValue* really,
        not the "StoredValue". StoredValue would be 'u.s.' or 'opinion'.)

        Values we do get here: (ViewValues)
        e.g. 'U.S.',  or 'Opinion'
        Also:
        'No Category (thx Service!)'
        'No Correct Category (thx Service!)'
         */
        console.log('FILTER! 01 arrayPassedIn: ', arrayPassedIn);
        /* Yes
        [] (98)
        {
        articleCategory_name: "U.S."
articleId_name: "5f5d244e4deea82fc68aab86"
articleTitle_name: "Now It’s Not Safe at Home Either. Wildfires Bring Ashen Air Into the House."
articleUrl_name: "https://www.nytimes.com/2020/09/12/health/fires-air-california.html"
}
         */

        console.log('FILTER! 02 : propertyPassedIn ', propertyPassedIn);
        /* Yes
        articleCategory_name
         */

        console.log('FILTER! 03 valuePassedIn: ', valuePassedIn);
        /*
        U.S.
        "5f5d244e4deea82fc68aab86"

        No Category (thx Service!)
        "5f3515d7dec9620d8d5fe63a"

        No Correct Category (thx Service!)
        "5af83649f2fffa14c4a22cd7"
         */

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
    } // /myFilter()


    mySpecialFilter(arrayPassedIn: any[], propertyPassedIn: string, valuePassedIn: any): any[] {
        /* e.g.
 NC     No Category (thx Service!) // << Count (right now): 61
        "5f3515d7dec9620d8d5fe63a"

 NCC    No Correct Category (thx Service!) // << Count (right now): 3
        "5af83649f2fffa14c4a22cd7"

        Looking to get back all 64.
        WUL.
         */

        let localSpecialVariableForNcc = 'No Correct Category (thx Service!)';
        /*
        We have a variable for NC: valuePassedIn
        Let's use one too for NCC. Avoid use of string in "if( a || b )" test below.
        (Turns out not needed, but, not bad practice, get away from string)
         */

        // NON-D.R.Y. I know, I know, I haven't refactored this out of the myFilter() above o well.
        if (!propertyPassedIn || valuePassedIn === undefined || !this._objArrayCheck(arrayPassedIn)) {
            return arrayPassedIn;
        }

        const mySpecialFilteredArray = arrayPassedIn.filter(
            myItem => {
                for (const myKey in myItem) {
                    if (myItem.hasOwnProperty(myKey)) {

                        // LET'S SEE A "NO CORRECT CATEGORY Example
                        // _id: 5af83649f2fffa14c4a22cd7
                        if (myKey === 'articleId_name' && myItem[myKey] === '5af83649f2fffa14c4a22cd7') {
                            // console.log('AAAA NCC 5af83649f2fffa14c4a22cd7 - myItem[propertyPassedIn] ', myItem[propertyPassedIn]);
                            /* Yes
                            N.B. 'articleId_name', not '_id' << !!!
                             */
                            // console.log('AAAA2 NCC 5af83649f2fffa14c4a22cd7 - valuePassedIn ', valuePassedIn);
                            /* No! << YER WRONG, WM.
                            We get:
                            'No Category (thx Service!)'
                            Supposed to be: << YER WRONG, WM.
                            'No Correct Category (thx Service!)'

                            Correction. Above is wrong.
                            The valuePassedIn ***WILL*** BE 'NC', not 'NCC'
                            Q. Why is that?
                            A. Because the "valuePassedIn" comes right off
                            the button the user clicked. The user clicked the
                            "No Category Assigned" button.
                            And we/I hard-coded to that button a value to pass
                            that is "No Category (thx Service!)"
                            But here in the Special Filter we wish to interpret
                            that value passed in as signifying:
                             "Hey, get me all records that have either"
                              - "No Category (thx Service!)"
                                -- OR --
                              - "No Correct Category (thx Service!)"
                              as the value in their
                              'articleCategory_name' property.
                              cheers.
                             */
                        }

                        /* *** TESTING  *****
                        JavaScript Logical OR || Operator Madness
                           *** *******  *****
                         */
                        if (myKey === propertyPassedIn) {
                            // articleCategory_name
                            if (myItem[myKey] === valuePassedIn) {
                                // console.log('AAAA-00 NC mySpecialFilteredArray: No Category (thx Service!) valuePassedIn ', valuePassedIn);
                                /* Yes
                                61 times. As expected.
                                 */
                            }
                            if (myItem[myKey] === 'No Correct Category (thx Service!)') {
                                // console.log('AAAA-01 NCC mySpecialFilteredArray: No Correct Category (thx Service!) valuePassedIn ', valuePassedIn);
                                /* Yes.
                                (Frank Goodness)
                                We do find this 3 times. As expected.
                                 */
                            }
                            if (myItem[myKey] === (valuePassedIn || localSpecialVariableForNcc)) {
                                // console.log('AAAA-02 COMBO mySpecialFilteredArray: (valuePassedIn || localSpecialVariableForNcc) valuePassedIn ', valuePassedIn);
                                /* ?? NO. 61. sheesh.
                                64 times????????? << Plobably not.
                                 */
                            }
                            if ( // << FINALLY. works. sheesh.
                                myItem[myKey] === valuePassedIn
                                 ||
                                myItem[myKey] === localSpecialVariableForNcc
                            ) {
                                // console.log('AAAA-03 DOUBLE-EXPRESSION COMBO mySpecialFilteredArray:  valuePassedIn ', valuePassedIn);
                                /* *** YES ***
                                64 times. As expected. << damn well might work.
                                O la.
                                 */
                            }
                        }
                        /* *** /TESTING  ***** */


                        if (
                            myKey === propertyPassedIn &&
                            (
                                myItem[myKey] === valuePassedIn
                                 ||
                                myItem[myKey] === localSpecialVariableForNcc
                            )
                        ) {
/* ^^^^^^^^^^^^^^^^^^^^
WHERE THE SEMI-HARD-CODED MAGIC HAPPENS
(How embarrassing.)

YE GODS-VILLE
https://addyosmani.com/blog/exploring-javascripts-logical-or-operator/
***
"The logical OR operator can also however be used in a number of other places:

('foo' || 'bar'); // returns foo

Although a specific falsy value hasn't been assigned to either side above, the first object is considered truthy in this case, which is why foo is returned. The second object would be returned if the first was falsy."
***


01 - Count: 61 (NC)
myItem[myKey] === ( valuePassedIn || 'No Correct Category (thx Service!)' )

02 - Count: 99 (all of 'em)
myItem[myKey] === 'No Correct Category (thx Service!)' || valuePassedIn
MISSING '( )' parentheses!

03 - Count: 3 (NCC)
myItem[myKey] === ('No Correct Category (thx Service!)' || valuePassedIn)

04 - Count: 3 (NCC)
myItem[myKey] === (localSpecialVariableForNcc || valuePassedIn)
( myItem[myKey] === (localSpecialVariableForNcc || valuePassedIn) ) // << extra parens? no difference. hmmph.

05- Count: 61 (NC)
myItem[myKey] === (valuePassedIn || localSpecialVariableForNcc)
// likewise here. // << extra parens? no difference. hmmph.

06 - Count: 64 (NC + NCC) // << H'rrah. "Sixth time's the charm!"
(
  myItem[myKey] === valuePassedIn
   ||
  myItem[myKey] === localSpecialVariableForNcc
)
OBVIOUSLY, I needed to CHANGE UP where I was using the '||' LOGICAL OR Operator.
Yeesh.
'AAAA-03 DOUBLE-EXPRESSION COMBO...'
Need to do two entire evaluation expressions, and '||' those.
You canNOT just do: (foo | bar).
If foo is truthy, it short circuits the hell out of there.
why i do not kno.
See above addyosmani biz.
Jesus H.-a-ball Christy.
 */
                            console.log('AAAA mySpecialFilteredArray: No Category (thx Service!) || No Correct Category (thx Service!) ', valuePassedIn);
                            return true;
                        }
                    }
                }
            }
        );

        return mySpecialFilteredArray;
    } // mySpecialFilter()


}
