import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, AfterViewChecked, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Article } from '../../articles/article.model';
import { ArticleService } from '../../articles/article.service';
import { DateService } from '../../core/services/date.service';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

    @Input()
    topOrBottom: string;
    /* t.b.d. ...
    WRONG: >> Above might be only true variable need to pass in to this reusable component
     */

    @Input('currentPageNumberInputName')
    currentPageNumberInput: number;
    // currentPageNumberInput = 1; // initial value (is this okay ?) (seems not)

    @Input('pageSizeInputName')
    pageSizeInput: number;
    // pageSizeInput = 5; // initial value (is this okay ?) (seems not)

    @Input('articlesCountInputName')
    articlesCountInput: number;
    // articlesCountInput = 100; // initial value (is this okay ?) (seems not)

    @Input('rangeAroundInputName')
    rangeAroundInput: number;


    @Output()
    paginationGetNextPageArticlesEvent = new EventEmitter<{
        pageNumberOutput: number,
        pageSizeOutput: number,
    }>();

    @Output()
    rangeAroundChangedPaginatorBottomEvent = new EventEmitter<{
        rangeAroundOutput: number
    }>();

    /* Interesting. // << Hmm. wrong approach. @Output/@Input for parent-child...
    Component Communication use case.
    Two instances of same Component (Paginator). (siblings, sorta ?)
    One ("Bottom") has functionality the other ("Top") does not.
    Top needs to hear from Bottom what new values are.

    Approach 2 ? - BehaviorSubject ( ? ) Service ( ?? ). Kinda tortured.
     */
/*
Approach 1 << NAH.
These @Output EventEmitters emit from child component, listened to in parent component. Not what I need.

    @Output()
    bottomTellsTopNewSetPageSizeEvent = new EventEmitter<{
        setPageSizeOutput: number,
    }>();

    @Output()
    bottomTellsTopNewRangeAroundEvent = new EventEmitter<{
        setRangeAroundOutput: number,
    }>();
*/


    pageSizeArray = [5,10,20]; // 50 also would be good
    /* ... but w only 93 articles, creates a little bug.
    Should show only buttons 1, 2. But we see a 3 created. tsk, tsk.
    Not going to go fix that logic. Instead, let's just leave 50 off
    till we have some 200+ articles, no? Grazie.
     */
    pageSizeSelected = 5; // default
    pageSize = this.pageSizeSelected;

    rangeAroundArray = [1,2];
    rangeAroundSelected = 2; // default
    RANGE_AROUND = this.rangeAroundSelected; // (on each side of currentPageNumber)
    /* Since both 'pageSize' and 'RANGE_AROUND' are configurable by user on U/I,
    no need to make either of them configurable as an "@Input()" here. (IMO.)

    Hah! Turns out, I certainly DID need to make these into @Input()s.
    Why?
    Because turns out I needed to pass both of these values:
    - UP from the "bottom" Paginator
    - TO the parent ArticleList Component
    - BACK DOWN TO the "top" Paginator
    Top Paginator was ignorant of changes to Page Size, and to Range Around.
    Above mechanism communicates those 2 value changes, from "bottom" to "top",
    via Parent. whoa.
     */

    currentPageNumber: number; // In NgOnInit() we initialize as 1 simply. (N.B. 1-based, not 0.)(D'uh)

    paginationButtonsControlledArray: number[]; // e.g. [1,2,3,4...15] simply
    lastPaginationNumber: number;

    /* Hmm. Good idea? Not good idea?
    https://stackoverflow.com/questions/48450349/math-function-not-working-in-angular-4-html
    YES WORKS KINDA KOOKY KRAZY
*/
    MyJavaScriptMath = Math; // << ?? yeah works. For use in template.

    articles: Article[]; // empty to begin
    articlesToDisplay: Article[]; // be that ALL, or FILTERED. TODO Hmm, re: Pagination how used etc. ? hmm.
    articlesCount: number;

    latestArticleDate: Date;
    latestArticleAnchorId: string; // articles[articles.length - 1].articleId_name

    constructor(
        private myArticleService: ArticleService,
        private myDateService: DateService,
        private myChangeDetectorRef: ChangeDetectorRef,
    ) {  }

    ngOnInit() {
        // console.log('111! PAGINATOR ngOnInit()! topOrBottom? ', this.topOrBottom);
        /* Yes
        top    or    bottom     << ok
        And, init run only once, upon visiting /articles/list    << good
         */

        this.currentPageNumber = 1; // init, "1"-based.
        this.currentPageNumberInput = 1; // init, "1"-based.

        this.pageSizeInput = this.pageSize; // init @ 5
        // ? this.articlesCountInput = 100; // init @ artificial 100 y not

        // this.rangeAroundInput = 2; // init we use 2 (choices are 1, 2)

        this.emitCallGetArticlesPaginated(this.currentPageNumber, this.pageSize);

    } // /ngOnInit()

    /*
    https://medium.com/bb-tutorials-and-thoughts/angular-understanding-angular-lifecycle-hooks-with-a-sample-project-375a61882478
     */

    ngOnChanges() { // << ??? ??? Runs even *before* ngOnInit() as I understand it. Hmm.
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // this.updateRedrawHereArticlesControlledPaginator(this.currentPageNumberInput, this.pageSizeInput, this.articlesCountInput);
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    }

    ngAfterViewInit() { // << No - didn't help ... Run Once Only!
        // console.log('I am from ngAfterViewINIT(). this.currentPageNumberInput is ', this.currentPageNumberInput); // 1
        // console.log('I am from ngAfterViewINIT(). this.currentPageNumber is ', this.currentPageNumber); // 1
        /*
        ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'NaN,NaN,NaN,NaN,NaN'. Current value: '1,2,3'.

        Fix involves ChangeDetectorRef (see below).
        Though we are not out of the woods.
         */
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        // this.updateRedrawHereArticlesControlledPaginator(this.currentPageNumberInput, this.pageSizeInput, this.articlesCountInput); // << Not here in "init"
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        /*
        https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
         */
        // this.myChangeDetectorRef.detectChanges(); // << Not here in "init"
    } // /ngAfterViewInit()


    ngAfterViewChecked() {

        // 1.  I believe this has to be run before # 2 below
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.updateHereRangeAroundForPaginator(this.rangeAroundInput);
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


        // console.log('I am from ngAfterViewChecked(). this.currentPageNumberInput is ', this.currentPageNumberInput); // 1 WAS: undefined
        // console.log('I am from ngAfterViewChecked(). this.currentPageNumber is ', this.currentPageNumber); // 1
        /*
        ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'NaN,NaN,NaN,NaN,NaN'. Current value: '1,2,3'.

        Fix involves ChangeDetectorRef (see below).
        Though we are not out of the woods.
         */
        // 2.   Then run this one
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.updateRedrawHereArticlesControlledPaginator(this.currentPageNumberInput, this.pageSizeInput, this.articlesCountInput);
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


        /*
        https://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
         */
        this.myChangeDetectorRef.detectChanges();
    } // /ngAfterViewChecked()


    emitCallGetArticlesPaginated(page, pagesize) { // << TODONE rename to callGetArticlesPaginated() or emit or something - T.B.D.
        // console.log('CHILD 00 - About to EMIT. this.topOrBottom: ', this.topOrBottom);
        // console.log('CHILD 01 - About to EMIT. page #: ', page);
        // console.log('CHILD 02 - About to EMIT. pagesize #: ', pagesize);
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.paginationGetNextPageArticlesEvent.emit({
            pageNumberOutput: page,
            pageSizeOutput: pagesize,
        });
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        /*
        Q. Could I (should I) do this "re-generate" / update of the
        Paginator, right here ( ? )
        A. Doubt it. Asynchronous call to API for next-page's-worth of
        Articles - need to wait till that returns, in particular for
        the "max # articles" (how many in Collection) figure.

        Well, I guess if you regard that "max # articles" as NOT critical
        to have immediately up-to-date (changes infrequently),
        then MAYBE this could work (  ?  )

        We'll see. ...
         */
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
/* BUGGY-ISSIMO. We'll try (?) ngOnChanges() ? whoa
        this.updateRedrawHereArticlesControlledPaginator(this.currentPageNumberInput, this.pageSizeInput, this.articlesCountInput);
*/
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        /*
        Q. Hmm, is this.currentPageNumber the same as the passed-in 'page' ?
        A. Have to find out...

        Q.2. Do we accept risk that this.articlesCount (max # articles) MAY
        have gone up (or down I suppose), and is not quite in perfect synch?
        A.2. Hell yeah. Doesn't make a lot of difference whether you get perfect
        "Last" button calculation, really.
         */

    } // /emitCallGetArticlesPaginated() // << Rename to "CALL" or "EMIT" ...

    emitPassUpToParentRangeAroundNewValue(rangeAroundToEmit) {
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        this.rangeAroundChangedPaginatorBottomEvent.emit({
            rangeAroundOutput: rangeAroundToEmit,
        });
        // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    } // /emitPassUpToParentRangeAroundNewValue()

    updateHereRangeAroundForPaginator(rangeAroundFromParent) {
        this.RANGE_AROUND = rangeAroundFromParent;
    }

    updateRedrawHereArticlesControlledPaginator(currentPageNumber, pageSize, articlesCount) { // TODONE: Rename to "update/redraw", not "generate" (I think)

        /* *** NEW *** ?
        Get currentPageNumber passed down to us in this method, as it
        is called from within this Child Component up above
        in ngAfterViewChecked()

        In fact, here we update ALL three variables, for the PaginatorComponent.
        That is, this little round-trip went like so:
        1. INIT  Paginator has initial values - e.g. 1, 5, 93 (Page 1; @ 5/pg.; 93 total)
        CHANGES:
        2.   Paginator click changes - e.g. 2, 5, 93 (Page 2; @ 5/pg.)
        2.A. Paginator click changes - e.g. 3, 5, 93 (Page 3; @ 5/pg.)
        3.   Paginator click changes - e.g. 3, 20, 93 (Page 3; @ 20/pg.)

        4. So when, from any one of those CHANGES, e.g. # 3, the
         child Paginator emits that '3' and that '20', and then the parent
        ArticleList processes those values, to fetch some 20 articles for page 3,
        then, when the parent updates those values, on the parent Component,
        what I was finding was, those values, "bound" to the @Inputs on the
        child Component in the parent's HTML, were **not** getting updated
        all the way to the child's Component variables. At least, this was the
        case for the "top" Paginator. Hmm. The "top" Paginator still thought
        that pageSize was 5, not the new 20, which the "bottom" Paginator had
        set it to.
        tsk, tsk. What to do.
        So I made a method here on the child Paginator (the method we are in!)
        that is kicked off by ngAfterViewInit().
        This method is where we take the @Input values, which apparently
        the parent Component *does* successfully bind and pass new values into
        (good), but we need to - it seems - manually pick up those
        values sitting on the @Inputs and assign them to the child Paginator
        Component's own variables. My goodness.
        See the following:
         */
        /* "MANUAL BINDING"
        So *here* is where I (sort of?) manually, explicitly "bind"
        the values gotten from the parent, via @Inputs, onto the
        child Component's appropriate variables.
        Note: This is needed I think for only the "top" Paginator.
        The "bottom" Paginator, since it has the "Set Page Size"
        select control, seems to already know the pageSize, whereas
        the "top" needs to be told. The "top" gets told, via this
        whole round-trip, from Paginator(bottom), to Parent, back to
        Paginator(top).
        Ye gods.
        TODONE: RangeAround still not getting to "top". Hang on.
        (Odd. I thought it was, yesterday. Hmm.)
         */
        this.currentPageNumber = currentPageNumber; // passed-in
        this.pageSize = pageSize; // passed-in DUMB BUG ??? YES. FIXED IT. oi.
        this.articlesCount = articlesCount; // passed-in. perhaps less critical to update (doesn't change often), but, may as well hey? hey.

        /*
                this.paginationButtonsControlledArray = Array.from(
                    {length: ( (articlesCount % pageSize > 0) ? (articlesCount/pageSize + 1) : (articlesCount/pageSize) )},
                    (myValue, myKey) => { return (myKey + 1); }
                );
        */
        // const RANGE_AROUND = 2; // (on each side of currentPageNumber) // make more global
        /* Output
        This makes you an Array of numbers. It is "1-based" (vs. 0).
        But it is "Controlled" in following sense:

        RANGE_AROUND: 2 (on each side of CURRPAGE)

        CURRPAGE: 1 (first)
        So: First | Prev | *1*, 2, 3, ... | Next | Last
        (THREE numeric entries) 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 2 (second)
        So: First | Prev | 1, *2*, 3, 4, ... | Next | Last
        (FOUR numeric entries) 1 + 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 3 (1 + RANGE_AROUND)
        So: First | Prev | 1, 2, *3*, 4, 5, ... | Next | Last
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 1 ellipsis

        CURRPAGE: 4 (e.g. in middle somewhere; not within RANGE_AROUND of either end)
        So: First | Prev | ..., 2, 3, *4*, 5, 6, ... | Next | Last
        (will get ellipsis on BOTH ends: '...'  <---->  '...')
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 2 ellipses


        CURRPAGE: 19 (last)
        So: First | Prev | ..., 17, 18, *19* | Next | Last
        (THREE numeric entries) 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 18 (penultimate)
        So: First | Prev | ..., 16, 17, *18*, 19 | Next | Last
        (FOUR numeric entries) 1 + 1 + RANGE_AROUND + 1 ellipsis

        CURRPAGE: 17 (terzultimate) (lastPaginationNumber - RANGE_AROUND)
        So: First | Prev | ..., 15, 16, *17*, 18, 19 | Next | Last
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 1 ellipsis

        CURRPAGE: 16 (not within RANGE_AROUND of either end)
        So: First | Prev | ..., 14, 15, *16*, 17, 18, ... | Next | Last
        (will get ellipsis on BOTH ends: '...'  <---->  '...')
        (FIVE numeric entries) 1 + (RANGE_AROUND * 2) + 2 ellipses

         */

        const firstPaginationNumber = 1; // of course
        // console.log('999 PAGINATOR this.lastPaginationNumber  pageSize ', this.lastPaginationNumber + ' pageSize: ' + pageSize);
        this.lastPaginationNumber = (articlesCount % pageSize > 0) ? (Math.floor(articlesCount / pageSize + 1)) : (articlesCount / pageSize);
        // console.log('999888 PAGINATOR this.lastPaginationNumber & articlesCount ', this.lastPaginationNumber + ' count: ' + articlesCount);

        // if ( currentPageNumber === 9 ) { // << Initial testing hard-coded; now removed :o)
        /* Sorry guys. switch / case no good for my
            special overall crazy needs here.
            Maybe you could figure out how to make use of it. Not me. cheers.

                switch () {
                    case:
                }
        */
        if (currentPageNumber === firstPaginationNumber) {
            //  ***  FIRST  ***

            let specialRangeAroundForFirst: number;
            // HARD-WON Trial & Error Information!
            // For "first" - RANGE 2: - 1   RANGE 1: - 0

            switch (this.RANGE_AROUND) { // << Here, simpler, yes can use switch
                case 2: {
                    specialRangeAroundForFirst = 1;
                    break;
                }
                case 1: {
                    specialRangeAroundForFirst = 0;
                    break;
                }
                default: {
                    console.log('WRONG! this.RANGE_AROUND must be 2 or 1. Instead looks like it is: ', this.RANGE_AROUND);
                }
            } // /switch()

            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1)}, // e.g. 3, or 2
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND - specialRangeAroundForFirst))); // funny math here RANGE 2 - 1   RANGE 1 0

                    // return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND - 0 ))); // funny math here RANGE 2 - 1   RANGE 1 0

                }
            );
        } else if (currentPageNumber === firstPaginationNumber + 1) {                  //  ***  SECOND  ***

            let specialRangeAroundForSecond: number;
            // HARD-WON Trial & Error Information!
            // For "second" - RANGE 2: + 0   RANGE 1: + 1

            switch (this.RANGE_AROUND) {
                case 2: {
                    specialRangeAroundForSecond = 0;
                    break;
                }
                case 1: {
                    specialRangeAroundForSecond = 1;
                    break;
                }
                default: {
                    console.log('WRONG! this.RANGE_AROUND must be 2 or 1. Instead looks like it is: ', this.RANGE_AROUND);
                }
            } // /switch()

            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1 + 1)}, // e.g. 4, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + specialRangeAroundForSecond))); // funny math here too RANGE 2 0   RANGE 1 + 1

                    // return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here too RANGE 2 0   RANGE 1 + 1

                }
            );

            /*  ***  *NOT* NEEDED  for  THIRD  *** (NOR TERZULTIMATE, fwiw)
                else if ( currentPageNumber === firstPaginationNumber + 1 + 1) {
                this.paginationButtonsControlledArray = Array.from(
                    {length: ((this.RANGE_AROUND) + 1 + 1 + 1)}, // e.g. 5
                    (myValue, myKey) => {
                        return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here too
                    }
                );
            }*/

        } else if ( currentPageNumber === this.lastPaginationNumber - 1) {
            // *** PENULTIMATE ***
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1 + 1)}, // e.g. 4, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here  RANGE 2 +1   RANGE 1 +1
                }
            );
        } else if ( currentPageNumber === this.lastPaginationNumber) {
            //  ***  ULTIMATE. LAST  ***
            // console.log('999888777PAGINATOR LAST this.lastPaginationNumber ', this.lastPaginationNumber); // Yes.
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND) + 1)}, // e.g. 3, or 2
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1))); // funny math here  RANGE 2 +1   RANGE 1 +1
                    /*
                    Q. Hmm, how come here at end (ULTIMATE, PENULTIMATE),
                    the number to add to RANGE_AROUND works
                    when consistently +1 ?

                    Whereas at the beginning (FIRST, SECOND) I had to
                    fuss with -1, 0, and +1 ?

                    And, the above is true for the two possible supported
                    RANGE_AROUND values, of both 2 (default), and 1.
                    Hmm.

                   A. I dunno. (sheepish grin)
                   Must be something about Beginning is hovering dangerously
                   near 0 and -1 (tsk, tsk) - needs special care.
                   While Ending is just out there at some big number
                    (94, whatever) - needs less "special" care. (I guess?)
                     cheers.
                     */
                }
            );
        }  else { //  ***  ALL OTHERS, "IN MIDDLE"  ***
            this.paginationButtonsControlledArray = Array.from(
                {length: ((this.RANGE_AROUND * 2) + 1)}, // e.g. 5, or 3
                (myValue, myKey) => {
                    return ((myKey + 1) + (currentPageNumber - (this.RANGE_AROUND + 1)));
                }
            ); // [1,2,3,4,5] ADD (currentPageNumber - (RANGE_AROUND + 1)) => [7,8,9,10,11]

            /* Hmm. Good idea? Not good idea?
            MyJavaScriptMath = Math;
            https://stackoverflow.com/questions/48450349/math-function-not-working-in-angular-4-html
            YES (above) WORKS KINDA KOOKY KRAZY

            Or, pipes:
            https://stackoverflow.com/questions/41027749/angular-2-how-round-calculated-number
             */
            // So, right now, not using this "lastPaginationNumber" but can't hurt to create it. cheers.
            // ACTUALLY, I *am* making (different) use of it. so keep on. cheers.
            // (moved it up above just a bit)
            /* YES (see above)
                        this.lastPaginationNumber = (articlesCount % pageSize > 0) ? (Math.floor(articlesCount/pageSize + 1)) : (articlesCount/pageSize);
            */
            // } // /if ( currentPageNumber === 9 )
        }

    } // /updateRedrawHereArticlesControlledPaginator()


    setPageSize() {
        this.pageSize = this.pageSizeSelected;
        // console.log('999666 PAGINATOR this.pageSizeSelected ', this.pageSizeSelected); // Yes. e.g. 20
        // re-run getting Articles for this same page, to re-set the Paginator

        /* Bug
        Interesting - some changes (e.g. pageSize from 5 to 20), if user is on high-numbered currentPageNumber (e.g. 15, with pageSize of 5),
        will cause BUG when you suddenly shift pageSize to 20, but keep
        currentPageNumber at 15. There are not 15 * 20 Articles. BUG, etc.

        Simplest solution: If user changes pageSize, we throw user back to
        currentPageNumber = 1.  Should avoid that BUG. j'espere.

                // BUG: Too hard to support *any* currentPageNumber
                this.emitCallGetArticlesPaginated(this.currentPageNumber, this.pageSize)
        */
        // As noted above, changing pageSize throws you back to page 1. cheers.
        this.emitCallGetArticlesPaginated(1, this.pageSize)
    } // /setPageSize()

    setRangeAround() {
        this.RANGE_AROUND = this.rangeAroundSelected;

        /* Hmm. New.
        Apparently I *do* need to pass this "RangeAround" value (1, or 2)
        UP to the Parent ArticleList Component, so that it can be bound
        back DOWN to the (other) Child Paginator Component.
        This is essentially FROM the "bottom" Paginator up and over and down
        TO the "top" Paginator.

        Note that for the somewhat similar "PageSize" value (5, 10, 20)
        I do *not* need a special, different, devoted method, to do the
        "up, over, back down" sending, to get it from "bottom" to "top"
        Paginator. No. Why? Because the existing method to go get another
        page's worth of Articles already carries that variable with it: pageSize.
        So it is already going up,over, back etc.

        But RangeAround isn't really needed in the ArticleList component, to
        fetch Articles etc. So I had no need and was not sending it.
        But now I discover I have to do so, just to pass this newly changed
        variable, in the "bottom" Paginator, up to some kind of Parent
        Component, so that it can come back down to the
        other ("top") child Paginator, that is otherwise ignorant of the change.
        "Component Communication" indeed. Strange use case. o well.
        WUL.
         */

        // NEW CALL (w-i-p) ok
        this.emitPassUpToParentRangeAroundNewValue(this.rangeAroundSelected);


        // PREVIOUS CALL (was already here, works, good)
        // re-run getting Articles for this same page, to re-set the Paginator

        /* N.B. No "BUG" re: Range
        No need to throw user back to page 1, for RangeAround change.
         */
        this.emitCallGetArticlesPaginated(this.currentPageNumber, this.pageSize);
    } // /setRangeAround()

}
