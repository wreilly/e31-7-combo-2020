import {Component, EventEmitter, OnInit, Output, OnDestroy, forwardRef} from '@angular/core';
// ARTICLE-DETAIL-TWO.COMPONENT.TS
// ****   FORM for EDIT MODE  **********
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, SelectControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core'; // << turns out we'll make use of. see note below
// Interesting. Above not needed; we get it from ArticleAddComponent instead as "My"...
import { MyErrorStateMatcher } from '../article-add/article-add.component';
/* FURTHER NOTE on ErrorStateMatcher
For EDITING (not during "Create") the CATEGORY <mat-select>, here in ArticleDetailTwoComponent,
we have SPECIAL NEED for a custom ErrorStateMatcher.
It has function to ensure the value is indeed one of the <mat-option>s.
Why?
Because we have/can-have older, existing, dirty data: NO category; WRONG VALUE in Category

So for that reason we WILL make use of the import from Angular Core, to
make a custom ErrorStateMatcher class right within this TypeScript file. See below
 */
// ****   /FORM for EDIT MODE  **********

import { ActivatedRoute, Router } from '@angular/router';

import { ArticleService } from '../article.service';
import {Article, Category} from '../article.model';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

// ** NGRX STUFF **
import { Store } from '@ngrx/store';
import * as UIActions from '../../shared/store/ui.actions'; // Here, we .dispatch(), yes.
import * as fromRoot from '../../store/app.reducer'; // But we do not need/do .select(). No.
// Well, not till now: .select() to find out if we are editing!  This Component "needs to know"
// Before, we were just sending out that info (are we editing or not) to other (parent) Component to know.
// cheers

import { DateService } from '../../core/services/date.service';


class myCustomCategorySelectErrorStateMatcher implements ErrorStateMatcher {
// SEE NOTE BELOW how this ErrorStateMatcher is in fact SUPERSEDED. OBSOLETE. o well.

    /* WORKING ASSUMPTION
    Any one form field can have one, & only one, ErrorStateMatcher.

    Therefore, this custom matcher must do two checks:
    1. special custom check re: categories...
    2. usual checks re: dirty, valid etc.

    That is, no, I don't believe I can lay on two ErrorStateMatchers,
    one to do the usual, and the custom one then made "skinnier"
    because that custom one would only be handling the custom biz.
    No.

    So, my custom matcher here does repeat (Non-D.R.Y.) bit of code.
    No biggie.
     */


    constructor(
       private myArticleService: ArticleService,
    ) { }


    categoriesHereInMatcher = this.myArticleService.getCategoriesInService();


    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
  /* Yes. BACK TO ORIG null */
  /* NOPE:
     "error TS2339: Property 'setValue' does not exist on type 'FormControl | { value: "news"; viewValue: "News"; }'."

    isErrorState(control: FormControl | {value: 'news', viewValue: 'News'}, form: FormGroupDirective | NgForm | null): boolean {
  */

        /* ****  UPDATE:  NOW SUPERSEDED !!!  *****

        O la la. "Overtaken by events!"
        This whole Custom ErrorMatcher, for Category, is
        now NOT REALLY NEEDED.
        O la.
        Excellent exercise in GETTING IT TO WORK, man. Good show.
        But, you THEN went on to actually FIX the potential
        issue *Upstream* of here.
        Whoa.

        That is:
        - We had (have!) data in DB with:
        1. Normal - a Category with BE value from our Categories e.g. 'u.s.'
        2. Missing - NO Category property at all on the DB
        3. Bad - Category BE value is spurious ("foobar") - NOT from our Categories

        We created this Custom ErrorMatcher to handle all 3.
        Before, scenario # 2 would get here as 'undefined'
        and scenario # 3 would get here as the bad data "foobar" whatever.
        ** (Now, with the upstream fix, they both get here as 'News'/'news' default) **
        But before that upstream fix, we handled these two scenarios
         (# 2 and # 3) by, as you'll see below,
        essentially "WHACKING" the data value to null.
        That is what would get this ErrorMatcher to finally
        return indeed a Boolean false (correct), and it is that which
        would finally successfully protect our Form Submit button -
        It could not be clicked with bad Category data like that.
        The user had to pick a good Category from dropdown (or Cancel out).
        h'rrah.
        cheers.

        It is just that now, this Custom ErrorMatcher is really
        >> No Longer Needed. <<

        Why?
        To reiterate: Because now with upstream fix, ALL Category values
        that get here will be acceptable. Either:
        - A true member of Categories 'u.s.', 'world', 'news' etc.
        - OR, bad/missing data that got transformed to the default Category 'news'
        So: No more error catching, here. Done earlier. cheers.

        sigh.
        We'll leave the damned code in, for now. ... ...
           ****  /UPDATE:  NOW SUPERSEDED !!!  *****
         */

       // console.log('Custom Error Matcher! 11 control ', control); // control  null    :o(
        // Huh. Must be vagaries of console.log etc why control.value shows null for above. sheesh.
        console.log('isErrorState() Custom Error Matcher! 11 control.value ', control.value);
        // {value: "u.s.", viewValue: "U.S."} // << good.
        // OR default of {value: "news", viewValue: "News"} // << also good.

       // console.log('Custom Error Matcher! this.categoriesHereInMatcher ', this.categoriesHereInMatcher);
        // Yes, all 8 Categories. bueno
        /*
        0: {value: "news", viewValue: "News"}
1: {value: "world", viewValue: "World"} ...
         */

        let categoryFoundAmongOptions: Category;
        // let categoryIsAmongOptionsOK = true; // init (some testing; done.)
        let categoryIsAmongOptionsOK = false; // init ORIG

        // console.log('Custom Error Matcher! 22 control.value ', control.value); // control.value  null    :o) ???????
        // {value: "u.s.", viewValue: "U.S."}

        categoryFoundAmongOptions = this.categoriesHereInMatcher.find(
            (eachCategory) => {

                // console.log('777A eachCategory ', eachCategory);
                /* Yeah:
                     {value: "world", viewValue: "World"}

Okay, so the the "predicate" handed in to the Array.find()
method (which I've named "eachCategory")
is the entire Category object (above) ... Good.
 */

                console.log('777 control.value 33 control.value ', control.value);
                /* Yes:
                For # 1 (below) e.g.
                {value: "u.s.", viewValue: "U.S."}

                And for # 2 and # 3 below, we get default:
                {value: "news", viewValue: "News"}
                 */
                /*
                1. - Normal. BE Category is one of the options. OK. 'u.s.'
                2. - Empty. BE Category is simply NOT a Property at all on BE. OK.
                3. - Dis-Allowed Value. BE Category is some string like "No Category etc.", or "foobar". Hmmph.
                 */

/* I had it wrong:
                return control.value === eachCategory;
*/
/* I had it wrong again:
                return control.value === eachCategory.viewValue;
*/
/* I had it wrong again again:
                return control.value === eachCategory.value;
*/
                return control.value.value === eachCategory.value; // << We have a winner.
                /* N.B. Above works right for Use Case # 1 = normal Category values
                Still failing for Use Case # 2 and # 3. << TODONE next to fix
                -------------
                -------
PRETTY GOOD PROGRESS:
-------
- We have THREE Use Cases for CATEGORY:
1. Normal Data.
BE articleCategory is simple string, one of the values from the Categories array of possible values, as managed on the Client FE in the ArticleService.categoriesInService.  e.g. 'u.s.' or 'politics'

2. Missing.
BE record has NO property at all named articleCategory. Older data.

3. Wrong Data.
BE articleCategory is simple string, but contains some other DIS-ALLOWED text NOT found in ArticleService.categoriesInService.  e.g. "foobar" or "" (empty string) or "There is No Category" etc.
----------

As of this morning, we FINALLY got Use Case # 1 above to WORK RIGHT.
You can EDIT the record, and the correct "viewValue" Category will appear. (e.g. 'U.S.')
You can CHANGE the Category from the dropdown (e.g. 'Opinion')
And when you SAVE the record the correct "value" will be saved to the BE (e.g. 'opinion')
And when you REVISIT the record the new correct "viewValue" will appear (e.g. 'Opinion').
WONDERFUL.
More moving parts than you would ever expect:
- FormData.append()
- .patchValue()
- errorStateMatcher()
- compareWith()
==========

NEXT UP:
- Use Case # 2 and # 3 need fixing. << DONE. whew.
Should mostly have to do with getting the .patchValue() right.
From there, we'll probably use a "default" choice like { value: 'news', viewValue: 'News' }
and then the errorStateMatcher and compareWith probably won't need to be touched.
We'll see.
-=-=-=-=-=-=-=

                -------------
                 */
            }
        ) // /.find()  << returns a Category object. From the array of available Categories. bueno.

        // console.log('categoryFoundAmongOptions straight-up ', categoryFoundAmongOptions);
        // undefined  when not found because Empty/Not Present = correct
        // undefined  when not found because Dis-Allowed Value = correct
        /* When found: yes:
        {value: "politics", viewValue: "Politics"}
         */

        if (categoryFoundAmongOptions) {  // << truthy. Not 'undefined'
            console.log('categoryFoundAmongOptions truthy seems! ', categoryFoundAmongOptions); // {value: "politics", viewValue: "Politics"}
            // categoryIsAmongOptionsOK = false;
            categoryIsAmongOptionsOK = true; // ORIG
        } else if (typeof categoryFoundAmongOptions === 'undefined') {
            console.log('0000 *** SHOULD NEVER GET HERE NOW See big Comment above about "Superseded" cheers. ****** control.value ', control.value);
            /*
            Hmm. This "update validity" thing does, er, ah, what it says.
            It (re-)runs validity biz, and if you're valid, you're valid.
            But I am here to say I wish to MARK THIS INVALID. o well.
            That is, I wanted to "set/change validity".
            Guess that's an anti-pattern, hey?
             */
/* Not doing anything for me. Don't need to run. cheers.
            control.updateValueAndValidity({

            });
*/
            /*
            updateValueAndValidity(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {

            https://angular.io/api/forms/AbstractControl#updatevalueandvalidity
            https://stackoverflow.com/questions/42197806/what-is-updatevalueandvalidity
             */


            console.log('000a *** ABOUT TO WHACK *************** control.value ', control.value);
            // yes undefined
            // yes Dis-Allowed AGAIN Category Text inserted at database

            // console.log('control.touched ', control.touched); // false
            // control.markAsTouched({ onlySelf: true });
            // control.markAsDirty({ onlySelf: true });

            /* Heavy Hammer Time
            Above "marking" biz did NOTHING to get this Control
            to INVALID. Sheesh.
            Time to WHACK the data, if it is Dis-Allowed, people!
             */
            /* btw...
            The bit of MongoDB shell to run, to insert the BAD DATA:
            MongoDB Enterprise > db.newarticles.updateOne({_id: ObjectId('5af83649f2fffa14c4a22cd7')},{ $set: {articleCategory: 'Dis-Allowed AGAIN Category Text inserted at database'}})
             */
            control.setValue(null, { onlySelf: false });
            /*
            Why is onlySelf: false, not true?
            Because with true, the control (Self) got to invalid (good), but the ancestor (form) did not (bad).
            With false, you get Self and ancestor to invalid (what we want).
            MBU.
             */
            // Q. Empty string '' enough? A. Yeah, we get to control.valid is false. and form.valid false too. who knew.
            // Q. Or null needed. Sheesh. A. Well, think I'll stick w. null y not.

            console.log('control.touched ', control.touched); // false
            console.log('control.dirty ', control.dirty); // false
            console.log('000b *** JUST WHACKED *************** control.value ', control.value); // yes null

            /* Category Control
            If I get here, the category value is either:
            - undefined because it was empty
            - undefined because it is spurious/wrong data, not allowed value

            Either way, looking to Invalidate the Control, hence the Form!
            Here's hoping "touch" does the trick. << NOPE
            Had to WHACK the data. See above.
            WUL.
             */
        } // /(typeof categoryFoundAmongOptions === 'undefined') {
            // /'0000 *** SHOULD NEVER GET HERE NOW See big Comment above about "Superseded" cheers. ******


        // **************
        console.log('******************');
        console.log('categoryFoundAmongOptions ', categoryFoundAmongOptions); // {value: "politics", viewValue: "Politics"}
        console.log('form.valid ', form.valid); // true
        console.log('control.valid ', control.valid); // true
        console.log('control.value ', control.value); // Politics
        /* <<<<< Shouldn't this be politics ???
        I corrected that. Now does read politics.
       See ArticleService myMapBEArticlesToFEArticles()
         */

        console.log('categoryIsAmongOptionsOK ', categoryIsAmongOptionsOK); // true
       // console.log('control ', control);
        /*
        FormControl {asyncValidator: null, pristine: true, ...
         */
        // console.log('control.invalid ', control.invalid); // false
        // console.log('control.dirty ', control.dirty); // false
        // console.log('control.touched ', control.touched); // false
        console.log('******************');
        // **************


        // return !!(categoryIsAmongOptionsOK);
        /* OLDER NOTE: Below - not working
        I am finding that setting my Boolean to false ain't cutting it.
        >> categoryIsAmongOptionsOK <<
        This is not causing the formControl and the form to be invalid,
        like I want it to.
        Fix: Explicitly mark the formControl as ".invalid" in code above.
        Hah! easier said than done, seems. oi.
         */
        /* NEWER NOTE: Below is working.
        I am now finding that both work (hmm).
        With or without 'categoryIsAmongOptionsOK' it works.
        Would appear that my heavy-handed "Hammer Time"
        to WHACK the data, had well invalidated
        the control and form and that is all that's needed.
        Don't really need mu custom boolean flag ("...AmongOptionsOK"). But, okay to leave it in what the hell.
        o la.
         */
        return !!(categoryIsAmongOptionsOK && control && control.invalid && (control.dirty || control.touched));
        // return !!(control && control.invalid && (control.dirty || control.touched)); // << don't "test" for "amongOptionsOK" ... wasn't working.
        /*
        Do Note: As in our regular ErrorStateMatcher (for Title, for URL),
        we in line above *omit* the "control.submitted" on purpose. Thx.
         */

    } // /isErrorState()
} // /myCustomCategorySelectErrorStateMatcher {}


@Component({
    selector: 'app-article-detail-two',
    templateUrl: 'article-detail-two.component.html',
    styleUrls: ['article-detail-two.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR, // 99% sure we ain't using this stuff no mo'. GOOD. GLAD.
            useExisting: forwardRef(() => ArticleDetailTwoComponent),
            // multi: true,
        }
    ],
})
export class ArticleDetailTwoComponent implements OnInit, OnDestroy, ControlValueAccessor {
    /* WebStorm IDE was saying ArticleDetailTwoComponent was "not declared in any Angular module"
    But it was all working okay.
    Hmm.

    In ArticlesModule this component certainly was in 'declarations:' (okay),
    but was not in 'exports'.
    I added it to 'exports', and the IDE no longer complains.
    Odd. I wonder what it is about this needs to be in exports.
    And why it worked nonetheless.
"o well!"
     */

    // ****   FORM for EDIT MODE  **********

    /*  ***  TEMPLATE-DRIVEN BIZ  *********
     */
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    displayTemplateDrivenForm = false; // <<<<<<<<<<<  NOW *HIDING* (temporary, experimental) Form
    displayReactiveFormSelectFormControlComponent = false; // <<<<<<<<<<<  NOW ALSO *HIDING* (temporary, experimental) Component
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    tdArticle: Article = {
        articleTitle_name: 'Our First TD Article hard-coded',
        articleId_name: 'hmm id',
        articleUrl_name: 'https://nytimes.com',
        // articleCategory_name: 'Politics', // 'category TD viewValue like World'
        articleCategory_name: 'politics', // 'category TD value like world'
    }

    // UH-OH, MIXING METHODS AND MEMBERS. O DEAR.

    get tdArticleCategory(): string {

        return;
    }

    set tdArticleCategory(tdArticleCategoryPassedIn: string) {

    }

    writeValue(articleCategoryValuePassedIn: string) { //  e.g. 'politics'
        /*
        Hmm, is this a tiny clue?
          // initialize a form control
             dir.valueAccessor.writeValue(control.value);
  https://indepth.dev/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms/
         */

        if (articleCategoryValuePassedIn) {
            console.log('TRUTHY articleCategoryValuePassedIn ', articleCategoryValuePassedIn);

        }

    } // /writeValue()

    registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }
    // Optional ...
    setDisabledState(isDisabled: boolean): void {

    }

    onChange: any = () => { };
    onTouched: any = () => { };



//         ***  /TEMPLATE-DRIVEN BIZ  *********

    selectedCategoryToEdit: Category;
    categoryViewValueSuchAsItIsReturned: string;

    myFormFieldsData: FormData = new FormData();

    editArticleFormGroup: FormGroup;
    articleTitle_formControl: FormControl;
    articleUrl_formControl: FormControl;
    articleCategory_formControl: FormControl;

    myOwnErrorStateMatcher: MyErrorStateMatcher; // << imported ! very nice.
    // Title and URL formControls

    myOwnCustomCategorySelectErrorStateMatcher: myCustomCategorySelectErrorStateMatcher;
    // Category formControl. Do see notes how in fact this thing is Superseded. Obsolete. o well.

    public categories: Category[]; // << from ArticleService now. :o)


    // ****   /FORM for EDIT MODE  **********

    urlHereToSeeWhetherEditingObservable$: Observable<string>; // works with | async; must .subscribe() to get at its value in TS logic

    urlHereToSeeWhetherEditingBehaviorSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('FAKEURL-INITIALVALUE-BEHAVIORSUBJECT');
    urlHereAsObservableFromBehaviorSubject$ = this.urlHereToSeeWhetherEditingBehaviorSubject$.asObservable();

    urlHere: string;

    areWeEditingObservable$: Observable<boolean>;
    areWeEditing = false;

    myUIIsLoadingStore$: Observable<boolean>;

    articleHereInDetailPage: { // BE version of an "Article". cheers
        // This "type" gets "BOOM-ed" onto, from .getArticle() BE retrieval, "whatIGot"
        _id: string,
        articlePhotos: string[],
        articleUrl: string,
        articleTitle: string,
        articleCategory: string,
    };

    constructor(
        private myArticleService: ArticleService,
        private myActivatedRoute: ActivatedRoute,
        private myRouter: Router,
        private myStore: Store,
        private myDateService: DateService,
    ) {
        /*
        https://angular.io/api/router/ActivatedRoute
         */
        // const url: Observable<string> = myActivatedRoute.url.pipe(map(segments => segments.join(''))); // angular.io one-liner. very nice.

        this.urlHereToSeeWhetherEditingObservable$ = myActivatedRoute.url.pipe(map((segments) => {
            console.log('Constructor. PIPE off ActivatedRoute.url. this.urlHere ', this.urlHere);
            /*
            undefined - ok
            5f3bc1b45f54a09d485800ca - ok
            5f3bc1b45f54a09d485800ca/edit - ok
             */

            return segments.join('/'); // << yeah needed.
        }));

    } // /constructor() {}


    ngOnInit() {

        this.areWeEditingObservable$ = this.myStore.select(fromRoot.getAreWeEditing);

        this.categories = this.myArticleService.getCategoriesInService();

        // ****   FORM for EDIT MODE  **********

        // INITIATE FormGroup, Controls
        this.articleTitle_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.minLength(10),
            ]);

        this.articleUrl_formControl = new FormControl(null,
            [
                Validators.required,
                Validators.pattern(
                    /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
                ),
            ]);
        /* URL_REGEXP from: (2015)
https://github.com/angular/angular.js/commit/ffb6b2fb56d9ffcb051284965dd538629ea9687a
 */

/* (Like Comment over in ArticleAdd)
 This "didn't break" EDITING an Article, but, seems not super intuitive. Let's not use.
(The ArticleDetailTwo editing form "Category" formControl was (appropriately, of course)
 populated by the correct Category "viewValue" (e.g. 'U.S.'). It did NOT show a "default" of "News". Good.)

        this.articleCategory_formControl = new FormControl({ value: 'news', viewValue: 'News' },
            [
                Validators.required,
            ]);
*/
/* WORKING FINE...  We'll stick with. */
        this.articleCategory_formControl = new FormControl(null,
            [
                Validators.required,
            ]);

        /* As noted on ArticleAddComponent:
Here on a SELECT form element, this "default formState" does *NOT* work (boo).
'News'   nor  'News-SERVICE'
Nor:
{ value: 'default value', viewValue: 'default viewValue'}
Nor:
{ value: 'politics', viewValue: 'Politics'}
*/

        this.editArticleFormGroup = new FormGroup({
            'articleTitle_formControlName': this.articleTitle_formControl,
            'articleUrl_formControlName': this.articleUrl_formControl,
            'articleCategory_formControlName': this.articleCategory_formControl,
        });

        console.log('XXX-000111 ngOnInit(). JUST CREATED this.editArticleFormGroup ', this.editArticleFormGroup);
        /* Weird.
        While *NOT* DEBUGGING (just RUNNING):
        - >>>>>   console.log() *mistakenly* (sez I) shows that this JUST-CREATED thing has VALUES. << WRONG-O.
        articleCategory_formControlName: "politics"
articleTitle_formControlName: "Trump Must Turn Over Tax Returns to D.A., Judge Rules"
articleUrl_formControlName: "https://www.nytimes.com/2020/08/20/nyregion/donald-trump-taxes-cyrus-vance.html"

          But, it don't got values!


        **DEBUGGING** shows you that it don't:   :o)

        Variables:
{
  "articleTitle_formControlName": null,
  "articleUrl_formControlName": null,
  "articleCategory_formControlName": null
}
         */

        this.myOwnErrorStateMatcher = new MyErrorStateMatcher(); // << imported. Used for Title, URL fields

        this.myOwnCustomCategorySelectErrorStateMatcher = new myCustomCategorySelectErrorStateMatcher(this.myArticleService);
        // Used for Category ('select') field

        // TODONE
        this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);


        // ****   /FORM for EDIT MODE  **********

        this.getArticle();

    } // /ngOnInit()


    getArticle() {

        this.urlHereToSeeWhetherEditingObservable$.subscribe(
            (urlFromActivatedRoute) => {
                this.urlHereToSeeWhetherEditingBehaviorSubject$.next(urlFromActivatedRoute);
                this.urlHere = urlFromActivatedRoute; // whamma-jamma. ok.
                if (this.urlHere.match(/\/edit$/g)) {
                    this.areWeEditing = true;
                } // /if() REGEX
                return urlFromActivatedRoute;
            }
        ); // /.subscribe() urlHere...Editing$

        this.urlHereAsObservableFromBehaviorSubject$.subscribe(
            (urlWeFinallyGotIHope) => {
                this.urlHere = urlWeFinallyGotIHope;
            }
        )

        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                const articleIdHereInDetailPage = paramsIGot['article_id'];
                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: any) => {
                            this.articleHereInDetailPage = articleIGot; // BOOM. whamma-jamma
                            this.tdArticle = articleIGot; // BOOM # 2. whamma-jamma for TEMPLATE-DRIVEN FORM (experiment)
                            // console.log('this.tdArticle ', this.tdArticle);
                            /* Hah. Boom a no-go for tdArticle
articleCategory: "politics"
articleTitle: "Trump Must Turn Over Tax Returns to D.A., Judge Rules"
articleUrl: "https://www.nytimes.com/2020/08/20/nyregion/donald-trump-taxes-cyrus-vanc
                             */
                            console.log('this.articleHereInDetailPage ', this.articleHereInDetailPage);
                            /* Example that Yeah Does Have CATEGORY.... (but no Photos, mind!) - another day
{_id: "5f3bc1b45f54a09d485800ca",
articleUrl: "https://www.nytimes.com/2020/08/17/opinion/trump-contested-election-protests.html",
articleTitle: "Trump Might Cheat. Activists Are Getting Ready.",
articleCategory: "politics",  // << BE convention.  'value', not 'viewValue'. Good.
__v: 0}
 */

                            /* Example with **NO CATEGORY** on BE/DB
articlePhotos: Array(1)
0: "["sometimes__1526384477707_15Mideast-Visual1-superJumbo-v3.jpg","sometimes__1526384477712_merlin_138129645_16f9c7c7-6c4d-44a0-83a2-d9cb8171d1ee-superJumbo.jpg","sometimes__1526384477721_merlin_138131967_f9da1d08-93e5-4061-9392-d9cb23c68454-superJumbo.jpg"]"
length: 1
__proto__: Array(0)
articleTitle: "Contrasting NUGATORY 01234 Many Crazy Images: Violence in Gaza, Embassy Celebration in Jerusalem"
articleUrl: "https://www.nytimes.com/2018/05/14/world/middleeast/gaza-jerusalem-embassy.html"
__v: 0
_id: "5afac7603fa7e949fa00a64e"
                             */


                            this.categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(articleIGot.articleCategory);
                            /* e.g. SEND IN 'u.s.' or 'world' (BE)
                            and GET BACK 'U.S.' or 'World'.  (FE)
                            Also handles **NO** Category and ***BAD*** Category ("foobar")
        const NO_CATEGORY         = 'No Category (thx Service!)';
        const NO_CORRECT_CATEGORY = 'No Correct Category (thx Service!)';
                             */
                            console.log('WWW3 this.categoryViewValueSuchAsItIsReturned ', this.categoryViewValueSuchAsItIsReturned);
                            /* Yes. When **NO CATEGORY** on BE:
                            No Category (thx Service!)
                             */

/* I.  TEST. Let's SKIP doing the "value-to-viewValue" biz here.
Leave it lowercased 'world', vs. 'World'. Okay? OKay.

                            this.articleHereInDetailPage.articleCategory = categoryViewValueSuchAsItIsReturned; // yes. okay. whamma-jamma one field  'Politics' viewValue OK
*/
/* II.  MUCH LATER. Hey! No more "SKIPPING"!
Time to do that minor transformation: Make the BE Category e.g. 'politics' become the FE Category e.g. 'Politics'
 */
                            let articleIGotWithFECategory: Article;
                            articleIGotWithFECategory = this.myArticleService.myMapBEArticlesToFEArticles(articleIGot);
                            console.log('WWW4 articleIGotWithFECategory ', articleIGotWithFECategory);
                            /* Yes.
                            articleCategory_name: "No Category (thx Service!)" // <<<<<<<<<<<<<<<<<
articleId_name: "5af83649f2fffa14c4a22cd7"
articleTitle_name: "What’s Less Edit URL We Be EdTNG MORE REACTIVELY Good for Pharma Isn’t Good for America (Wonkish)"
articleUrl_name: "https://www.nytimes.com/2020/08/15/us/covid-college-tuition.
                             */

                            /* Oi! TODO 2020-09-05 see you tomorrow morning the 6th. Fix this. :o)
                            Finally fix this damned bug.
                            When **NO** Category, get that default value
                            to say so (lines above), and then,
                            here (below), STICK IT ONTO
                            our "articleHereInDetailPage" fer chrissake
                             */
                            // this.articleHereInDetailPage.articleCategory = articleIGotWithFECategory.articleCategory_name; // FE viewValue. 'U.S.' hmm.
                            this.articleHereInDetailPage.articleCategory = articleIGot.articleCategory; // BE value. 'u.s.' hmm.


                            this.myStore.dispatch(new UIActions.TellingYouMyId(
                                {myIdIsInAction: articleIdHereInDetailPage}
                            ));

                            if (this.areWeEditing) {
                                this.myStore.dispatch(
                                    new UIActions.TellingYouIfWeAreEditing(
                                        {areWeEditingInAction: true}
                                    )
                                );
                            }

                            /* ***********************************
                                FORM EDIT
                                **********************************
                             */


                            // NEW. Let's add editing the damned CATEGORY
                            // console.log('XXXYYYCategory-111-BEFORE this.editArticleFormGroup.controls[\'articleCategory_formControlName\'] ', this.editArticleFormGroup.controls['articleCategory_formControlName']);


/* NO. We are NOT patching or setting the FE value for Category (e.g. 'U.S.') onto the Form. No.

                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(categoryViewValueSuchAsItIsReturned, { onlySelf: true }); // << you're setting a type: string. (But, note! - this puts the ViewValue on! (not what we want) 'Politics' not 'politics'. Oi!
                            console.log('POST-PATCHV 01 this.editArticleFormGroup.value ', this.editArticleFormGroup.value);
*/
                            // DEBUG shows this is simply null right here. cheers. ok.
                            /*
                            articleCategory_formControlName: null // <<< ??
articleTitle_formControlName: null
articleUrl_formControlName: null
                             */
 // Yes:
 /* .setValue() OK, but I prefer .patchValue() y not
                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(this.selectedCategoryToEdit, { onlySelf: true });
 */

/* NO. We are not patching the (as of yet undefined) "selectedCategoryToEdit" -- even though it **is** of type Category.

                            console.log('PRE-PATCHV 02 this.selectedCategoryToEdit ', this.selectedCategoryToEdit); // undefined
                            this.editArticleFormGroup.get('articleCategory_formControlName').patchValue(this.selectedCategoryToEdit, { onlySelf: true });
                            console.log('POST-PATCHV 02 this.editArticleFormGroup ', this.editArticleFormGroup);
*/
                            // DEBUG shows this above is undefined.  Let's just comment it out.
                            /*
                            articleCategory_formControlName: "u.s." // <<< ??
articleTitle_formControlName: "Mueller Happy 2020 Plans to Wrap Up Obstruction Inquiry Into Trump by Sept. 1, Giuliani Says"
articleUrl_formControlName: "https://www.nytimes.com/"
                             */

                            /* Nope! Too Early, for "this.selectedCategoryToEdit", kid.
                                                        this.editArticleFormGroup.get('articleCategory_formControlName').setValue(this.selectedCategoryToEdit, { onlySelf: true }); // << hmm, we were: 1) trying to set a value that's undefined, right now. and 2) (I think?) trying to set a whole Object (Category {}), not just a string. Hmm.
                            */

                            // console.log('XXX-111 this.editArticleFormGroup ', this.editArticleFormGroup);
                            /* DEBUG vs. CONSOLE.LOG() note
                            As elsewhere, the console.log() does not truly display the values that Debugging does show.
                            In this case, namely, empty or null or undefined or whatever they are.
                            cheers.
                             */
                            // console.log('XXXZZZ-111 this.editArticleFormGroup.getRawValue() ', this.editArticleFormGroup.getRawValue());
                            /* DEBUG vs. CONSOLE.LOG() note
                            Hah. This ".getRawValue()" appears to behave more like the Debugger, when it comes to "truthful" display
                            of what the variable has, at this moment.
                            Interesting.
                             */

                            // console.log('XXXYYYCategory-111-AFTER this.editArticleFormGroup.controls[\'articleCategory_formControlName\'] ', this.editArticleFormGroup.controls['articleCategory_formControlName']);

                            /* NO. FAILS. 2020-09-04 >>  LATEST. GREATEST. 2020-09-02
Interesting.
This introduced a BUG.
To assign the ***FE*** version of the Category (e.g. 'Politics') to the
form control's value, is Not Right.
- It does not show as "display" upon shifting to Edit mode
- It does not match any <mat-option> value for the CompareWith function
Boo-hoo.

Fix: Go back to other .patchValue() below that assigns the ***BE*** version of Category
(e.g. 'politics")

                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: this.articleHereInDetailPage.articleTitle,
                                articleUrl_formControlName: this.articleHereInDetailPage.articleUrl,

                                articleCategory_formControlName: articleIGotWithFECategory.articleCategory_name, // 'Politics' <<<<<<<<<<<< NOPE
                            });

***** NAH ^^^^^^^^ didn't work!
*/

// WORKS TOO. EQUALLY LOVELY.
/*
                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: this.articleHereInDetailPage.articleTitle,
                                articleUrl_formControlName: this.articleHereInDetailPage.articleUrl,

                                articleCategory_formControlName: this.articleHereInDetailPage.articleCategory, // 'politics' << NO. Now it is 'Politics' sigh
                            });*/

                            if (this.categoryViewValueSuchAsItIsReturned.match(/^No.*Category/)) {
                                /* We have either of:
                                    const NO_CATEGORY         = 'No Category (thx Service!)';
                                    const NO_CORRECT_CATEGORY = 'No Correct Category (thx Service!)';
                                 */
                                console.log('this.categoryViewValueSuchAsItIsReturned NO CATEGORY HEY?  REGEX ', this.categoryViewValueSuchAsItIsReturned);
                                /* Yes. (Frank goodness.)
No Category (thx Service!)
No Correct Category (thx Service!)
 */

                                this.editArticleFormGroup.patchValue({
                                    articleTitle_formControlName: articleIGot.articleTitle, // 'DEFAULT TITLE HEY?',
                                    articleUrl_formControlName: articleIGot.articleUrl,

                                    articleCategory_formControlName: {
                                        value: 'news', // Finally, appears that HERE is where we use a "default". hmm.
                                        viewValue: 'News',
                                    },
                                });

                            } else if (this.categoryViewValueSuchAsItIsReturned) {
                                // We've checked above that by time you get here, it MUST (!) be a valid Category. cheers.
                                console.log('this.categoryViewValueSuchAsItIsReturned YES HAPPY CATEGORY HEY? ', this.categoryViewValueSuchAsItIsReturned);
                                /* Yes.
                                Politics
                                World
                                etc.
                                 */

                                this.editArticleFormGroup.patchValue({
                                    articleTitle_formControlName: articleIGot.articleTitle, // 'DEFAULT TITLE HEY?',
                                    articleUrl_formControlName: articleIGot.articleUrl,

                                    articleCategory_formControlName: {
                                        value: articleIGot.articleCategory,
                                        viewValue: this.categoryViewValueSuchAsItIsReturned,
                                    },
                                });

                            } else {
                                console.log('SOMETHING WRONG. this.categoryViewValueSuchAsItIsReturned is neither a Category, nor one of our two Error Messages. Sheesh! ', this.categoryViewValueSuchAsItIsReturned);
                                // Not Seen. (also Frank Goodness.)
                            }

/* ***  MONGODB  NOTES  ***
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
const NO_CATEGORY         = 'No Category (thx Service!)';
const NO_CORRECT_CATEGORY = 'No Correct Category (thx Service!)';
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
MONGODB

- UPDATE One Record
01 -- Write bad data to articleCategory    << NO_CORRECT_CATEGORY
02 -- Make articleCategory empty string "" << NO_CORRECT_CATEGORY
03 -- Make articleCategory null value      << NO_CORRECT_CATEGORY
04 -- REMOVE articleCategory property altogether   << NO_CATEGORY
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


00 -- To begin, we have a record with empty string "" for articleCategory << NO_CORRECT_CATEGORY

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.find({_id:ObjectId('5afac7603fa7e949fa00a64e')})
{ "_id" : ObjectId("5afac7603fa7e949fa00a64e"), "articlePhotos" : [ "[\"sometimes__1526384477707_15Mideast-Visual1-superJumbo-v3.jpg\",\"sometimes__1526384477712_merlin_138129645_16f9c7c7-6c4d-44a0-83a2-d9cb8171d1ee-superJumbo.jpg\",\"sometimes__1526384477721_merlin_138131967_f9da1d08-93e5-4061-9392-d9cb23c68454-superJumbo.jpg\"]" ], "articleUrl" : "https://www.nytimes.com/2018/05/14/world/middleeast/gaza-jerusalem-embassy.html", "articleTitle" : "Contrasting NUGATORY 012349988 Many Crazy Images: Violence in Gaza, Embassy Celebration in Jerusalem", "__v" : 0, "articleCategory" : "" }


01 -- Write bad data to articleCategory    << NO_CORRECT_CATEGORY

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.updateOne({_id: ObjectId('5f5686234d2835ae66510f49')},{ $set: {articleCategory: 'MORE Dis-Allowed AGAIN Category Text inserted at database'}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }


02 -- Make articleCategory empty string "" << NO_CORRECT_CATEGORY

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.updateOne({_id: ObjectId('5f554ebb4d2835ae66510f48')},{ $set: {articleCategory: ''}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }


03 -- Make articleCategory null value      << NO_CORRECT_CATEGORY

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.updateOne({_id: ObjectId('5f55403b4d2835ae66510f47')},{ $set: {articleCategory: null}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }


04 -- REMOVE articleCategory property altogether   << NO_CATEGORY

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.updateOne({_id: ObjectId('5f523b3f4d2835ae66510f45')},{ $unset: {articleCategory: ""}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

MongoDB Enterprise ClusterWR03-shard-0:PRIMARY> db.newarticles.find({_id:ObjectId('5f523b3f4d2835ae66510f45')})
{ "_id" : ObjectId("5f523b3f4d2835ae66510f45"), "articleUrl" : "https://www.nytimes.com/2020/09/03/us/michael-reinoehl-arrest-portland-shooting.html", "articleTitle" : "Suspect EDIT 666777888 in Fatal Portland Shooting Is Killed by Officers During Arrest", "__v" : 0 }

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
   ***  /MONGODB  NOTES ***
 */


/* WORKS. LOVELY. 2020-09-07
                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: articleIGot.articleTitle, // 'DEFAULT TITLE HEY?',
                                articleUrl_formControlName: articleIGot.articleUrl,

                                articleCategory_formControlName: {
                                    value: articleIGot.articleCategory,
                                    viewValue: this.categoryViewValueSuchAsItIsReturned,
                                },
                            });
*/
                            // console.log('POST-PATCHV 03 Category: string this.editArticleFormGroup.value ', this.editArticleFormGroup.value);
                            console.log('POST-PATCHV 04 Category: {}object this.editArticleFormGroup.value ', this.editArticleFormGroup.value);
                            /* LATEST 2020-09-06
                            YES:
                            {
                            articleCategory_formControlName:
value: "[object Object]"
viewValue: "NO_CORRECT_CATEGORY"
__proto__: Object
articleTitle_formControlName: "Mueller VERY Happy 2020 Plans to Wrap Up Obstruction Inquiry Into Trump by Sept. 1, Giuliani Says"
articleUrl_formControlName: "https://www.nytimes.com/"
                               }
                             */
                            /* Yes
                            DEBUG shows this is the BE value: 'u.s.'   Good.
                             */

/* SEEMINGLY N-O-T. Harrumph. ?? <<<< Yo! you did have it right, way back when. Now (2020-09-06) finally figgered that out.
Nah. Below - Don't create a Category object here, to store on that FormControl.
Just leave as simple string value, for the BE stored version: 'world' or 'politics'

                                articleCategory_formControlName: {
                                    value: articleIGot.articleCategory, // 'politics'
                                    viewValue: this.articleHereInDetailPage.articleCategory // 'Politics'
                                }
                                 });
*/

/* **  LITTLE EXPERIMENT ZONE.  **
We do not use the line below that YES does WORK,
because we already took care of this data value (for Category, on the Form)
in the .patchValue just above, for the entire Form.
cheers.

/!* NO. Wrong. patches value of the complete Category object. No.  { value: , viewValue: }
                            this.editArticleFormGroup.get('articleCategory_formControlName').patchValue(this.selectedCategoryToEdit, { onlySelf: true });
*!/
/!* NO. Wrong. sets value of the wrong property: the 'viewValue' property. No.   viewValue: 'Politics'
                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(categoryViewValueSuchAsItIsReturned, { onlySelf: true }); // << you're setting a type: string. (But, note! - this puts the ViewValue on! (not what we want) 'Politics' not 'politics'. Oi!
*!/
/!* YES.  Right. patches value of the right property: the 'value' property,
         as now stored in both:
         1) the articleIGot.articleCategory (from the BE)
         2) the articleHereInDetailPage.articleCategory (from the BE)
 *!/

// 1. yes
                            this.editArticleFormGroup.get('articleCategory_formControlName').patchValue(articleIGot.articleCategory, { onlySelf: true });
// 2. yes
                            this.editArticleFormGroup.get('articleCategory_formControlName').patchValue(articleHereInDetailPage.articleCategory, { onlySelf: true });

**  /LITTLE EXPERIMENT ZONE.  **
*/


                            // console.log('XXX-222 this.editArticleFormGroup ', this.editArticleFormGroup);
                            // console.log('XXXZZZ-222 this.editArticleFormGroup.getRawValue() ', this.editArticleFormGroup.getRawValue());
                            // console.log('XXXYYYCategory-222 this.editArticleFormGroup.controls[\'articleCategory_formControlName\'] ', this.editArticleFormGroup.controls['articleCategory_formControlName']);
                            // console.log('XXXYYYTitle-222 this.editArticleFormGroup.controls[\'articleTitle_formControlName\'] ', this.editArticleFormGroup.controls['articleTitle_formControlName']);


                            /* *** These 3 Lines Don't Do Anything. Cheers. *** */
/*
                            let localCategoryToBeSelected: Category;
                            localCategoryToBeSelected = this.localGiveMeFullCategoryObject(categoryViewValueSuchAsItIsReturned);
                            console.log('localCategoryToBeSelected ', localCategoryToBeSelected);
*/
                            /* *** /These 3 Lines Don't Do Anything. Cheers. *** */

                            /* ***********************************
                                 /FORM EDIT
                               **********************************
                            */

                        } // /next(articleIGot)
                    ); // /.subscribe()  ...Service.getArticle()
            }) // /.subscribe()  myActivatedRoute.params
    } // /getArticle()

    myCompareOptionCategoryValuesIFLOGIC( // THIS *DOES* WORK :o)
        // myCompareOptionCategoryValuesIFLOGIC << attempt at full IF logic, vs. Ternary
        // ***  IFLOGIC NO LONGER USED  *********  (Was Experiment)
        optionCategory1: any,
        optionCategory2: any
    ): boolean {
        console.log('COMPARE 1 ', optionCategory1); // opinion
        // console.log('COMPARE 1.value ', optionCategory1.value); // undefined
        console.log('COMPARE 2 ', optionCategory1); // opinion

        if (optionCategory1 && optionCategory2) {
            console.log('COMP 00 if (optionCategory1 && optionCategory2) ', optionCategory1);
            if (optionCategory1 === optionCategory2) { // WORKS. None!
/*
            if (optionCategory1.value === optionCategory2.value) { // VALUE
*/
            // if (optionCategory1.viewValue === optionCategory2.viewValue) { // VIEWVALUE
                console.log('COMP 01-NO!V-1 if (optionCategory1 === optionCategory2)  1: ', optionCategory1);
                console.log('COMP 01-NO!V-2 if (optionCategory1 === optionCategory2)  2: ', optionCategory2);
                console.log('COMP 01-V if (optionCategory1.value === optionCategory2.value)  ', optionCategory1.value);
                console.log('COMP 01-VV if (optionCategory1.viewValue === optionCategory2.viewValue)  ', optionCategory1.viewValue);
                return true;
            } else {
                if (optionCategory1 === optionCategory2) {
                    console.log('COMP 02 else { if (optionCategory1 === optionCategory2)  ', optionCategory1.viewValue);
                    return true;
                } else {
                    console.log('COMP 03 else { else return false  ');
                    return false;
                }
            }
        }

/* Hmm, I *think* I meant to Comment this out!
        return optionCategory1 && optionCategory2 ? optionCategory1.viewValue === optionCategory2.viewValue : optionCategory1 === optionCategory2;
*/
    } // /myCompareOptionCategoryValuesIFLOGIC() << attempt at full IF logic, vs. Ternary


    myCompareOptionCategoryValues(optionCategory1: any, selectionCategory2: any): boolean {
        /*
        "Function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection. A boolean should be returned."
        https://v9.material.angular.io/components/select/api#MatSelect
         */
        // myCompareOptionCategoryValuesTERNARYTHISWORKS
        // myCompareOptionCategoryValuesORIGINALTERNARY
        console.log('COMPARE 1 optionCategory1 ', optionCategory1); // u.s., or news etc.   BE value
        console.log('COMPARE 1.value optionCategory1.value ', optionCategory1.value); // undefined
        console.log('COMPARE 1.value optionCategory1.viewValue ', optionCategory1.viewValue); // undefined

        console.log('COMPARE 2 selectionCategory2 ', selectionCategory2);
        /* e.g.
        1. Render Component for Editing:
        {value: "opinion", viewValue: "Opinion"}
        2. Submit Edit, re-render for Display:
        null
         */
        if (selectionCategory2) {
            /* Test whether null. (see above)

            Turns out, AFTER edit/update done, in the
            re-rendering of this same Component (now for Display)
            there is NO "selection" value (apparently) for
            the formControl for "Category"
            (the "selectionCategory2" variable above).

            And, for some reason ( ? ), during the
            re-rendering (after Edit submit), this
            CompareWith() function gets run again,
            and it finds NO value for "selectionCategory2"
            as it goes to compare each <mat-option>
            "optionCategory1" to the "selectionCategory2".
            That latter one is null.
             */
            console.log('COMPARE 2 selectionCategory2.value ', selectionCategory2.value);
            console.log('COMPARE 2 selectionCategory2.viewValue ', selectionCategory2.viewValue);
        }


        /* YES. Worked. Try # 3 as t'were:
         */
        return optionCategory1 && selectionCategory2 ? optionCategory1.value === selectionCategory2.value : optionCategory1 === selectionCategory2;
        /* YES.
        Here is why Try # 3 **DID WORK** :)

COMPARE 1 optionCategory1  {value: "politics", viewValue: "Politics"}
article-detail-two.component.ts:813 COMPARE 1.value optionCategory1.value  politics // <<<<<<<<<<<<<<<<<<<<<<<
article-detail-two.component.ts:814 COMPARE 1.value optionCategory1.viewValue  Politics
article-detail-two.component.ts:816 COMPARE 2 selectionCategory2  {value: "politics", viewValue: "Politics"}
article-detail-two.component.ts:817 COMPARE 2 selectionCategory2.value  politics  // <<<<<<<<<<<<<<<<<<<<<<<<<<<
article-detail-two.component.ts:818 COMPARE 2 selectionCategory2.viewValue  Politics

At the risk of (even) further confusion:
- ".value"
Note that we DO test for equality on the ".value" - the BE-stored value (e.g. 'u.s.') = Good. << That 'value' is kind of like an ID. A human-readable ID.
- ".viewValue"
Note that, with the objects above to compare (optionCategory1 and selectionCategory2) both
being complete Category objects, it is technically plausible that we *COULD* test (it would appear)
for equality on the ".viewValue" as well, or in stead. They too appear to match, just fine.
BUT! We don't test on them. And we shouldn't.
Why?
Because the whole point of having the setup of "value" stored vs. "viewValue" displayed is:
---- to retain FLEXIBILITY.
How so? For example:
If/when the viewValue needs to change (this does happen) (like, some senior editor comes along one fine day and says,
"Why in the world does that say "U.S."? It should say "U.S.A." - or similar).
If that occurs, then the *stored* value remains 'u.s.' (editor never sees it), while
the *view* value will be changed to 'U.S.A.' Okay.
But, what about all the records created before the senior editor came along?
Ah-hah. SO - the real key part here is:
- New:
From the date Going Forward that the editor makes his dictates, THEN your
data records will be: {value: 'u.s.', viewValue: 'U.S.A.'}  Fine.
- Existing:
But the FLEXIBILITY part comes from your **NOT HAVING TO CHANGE** all those
EXISTING data records, which will STILL BE: {value: 'u.s.', viewValue: 'U.S.'} // <<<<< PAYOFF TIME, BABY. O YEAH. FLEXIBILITY.

~~ The End. ~~

*/



        /* YES. (PARTIAL I guess) Try # 2 as t'were:
YEAH. SORTA anyway
         */
        // return optionCategory1 && selectionCategory2 ? optionCategory1.value === selectionCategory2 : optionCategory1 === selectionCategory2;
        /* YES.
        Here is why Try # 2 **DID (PARTIALLY) WORK** :)
        COMPARE 1 optionCategory1  {value: "u.s.", viewValue: "U.S."}
article-detail-two.component.ts:755 COMPARE 1.value optionCategory1.value  u.s. // <<<<<<<<<<<<<<<<<<<<<<<
article-detail-two.component.ts:756 COMPARE 1.value optionCategory1.viewValue  U.S.
article-detail-two.component.ts:758 COMPARE 2 selectionCategory2  u.s. // <<<<<<<<<<<<<<<<<<<<<<<<<<<
article-detail-two.component.ts:759 COMPARE 2 selectionCategory2.value  undefined
article-detail-two.component.ts:760 COMPARE 2 selectionCategory2.viewValue  undefined
         */


/* NO. Try # 1 as t'were
        return optionCategory1 && selectionCategory2 ? optionCategory1 === selectionCategory2.value : optionCategory1 === selectionCategory2;
*/
        /* NO. Try # 1 as t'were:
        Here is why above did NOT work:

        COMPARE 1 optionCategory1  {value: "u.s.", viewValue: "U.S."}
article-detail-two.component.ts:755 COMPARE 1.value optionCategory1.value  u.s.
article-detail-two.component.ts:756 COMPARE 1.value optionCategory1.viewValue  U.S.
article-detail-two.component.ts:758 COMPARE 2 selectionCategory2  u.s.
article-detail-two.component.ts:759 COMPARE 2 selectionCategory2.value  undefined
article-detail-two.component.ts:760 COMPARE 2 selectionCategory2.viewValue  undefined
         */
/*
        return optionCategory1 && optionCategory2 ? optionCategory1.viewValue === optionCategory2.viewValue : optionCategory1 === optionCategory2;
*/
    } // myCompareOptionCategoryValues


    localGiveMeFullCategoryObject(viewValuePassedIn: string): Category {
        // console.log('localGiveMeFullCategoryObject - viewValuePassedIn ', viewValuePassedIn); // Yes. e.g. 'Politics', or, could be 'No Category "viewValue" (thx Service!)'
        const NO_CATEGORY = 'No Category "viewValue" (thx Service!)'; // << Same as in ArticleService

        if (viewValuePassedIn === NO_CATEGORY) {
            let noCategoryCategory: Category = {
                value: 'No Category "value" (thx ArticleDetailTwo!)',
                viewValue: NO_CATEGORY
            }
            this.selectedCategoryToEdit = noCategoryCategory;

        } else {

            let viewValueToCompare: string = viewValuePassedIn; // e.g. 'Politics'
            let found: boolean = false;
            for (let i = 0; i < this.categories.length; i++) {
                let categoryThisTime: Category = this.categories[i];
                if (categoryThisTime.viewValue === viewValueToCompare) {
                    found = true;
                    this.selectedCategoryToEdit = categoryThisTime;
                    /*
                    Assign correct found Category to this class member, "this.selectedCategoryToEdit"
                    No need really to "return" the value.
                     */
                }
            }
        }
        console.log('555 local blah blah this.selectedCategoryToEdit ', this.selectedCategoryToEdit);
        /* Yeah!
        {value: "living", viewValue: "Living"}
         */
        // console.log('555a local blah blah this.selectedCategoryToEdit ', this.selectedCategoryToEdit.value);
        /* Yep
        living
         */

        return this.selectedCategoryToEdit; // ( ? ) does this need to be 'returned'? (can't hurt I guess)
    } // /localGiveMeFullCategoryObject()


    processTemplateDrivenFormEdit(whatFormRefValueIsPassedIn: any): void {
        // ***  NO LONGER USED   ********** (was Experiment)

        console.log('TD !! processTemplateDrivenFormEdit - whatFormRefValueIsPassedIn ', whatFormRefValueIsPassedIn);
        /*
        {articleTitle: "Our First TD Article hard-coded"}
        {articleTitleNameInTemplate: "Our First TD Article hard-coded"}
        {articleTitleNameInTemplate: "Our WE CHANGED IT First TD Article hard-coded"}
         ^^^^^^^^^^^^
         name from HTML template

         CATEGORY ... "inching our way to-wards..."
         {articleTitleNameInTemplate: "Our First TD Article hard-coded", articleCategoryNameInTemplate: "business"}

         */

    }

    processReactiveFormEdit() {
        // ****   FORM for EDIT MODE  **********

        console.log(`TITLE = this.editArticleFormGroup.get('articleTitle_formControlName').value`, this.editArticleFormGroup.get('articleTitle_formControlName').value);
        /*
        Coronavirus 234 Live Updates: Birx Urges Bar Closures and Limits on Gatherings
         */
        console.log(`FORM ENTIRE = this.editArticleFormGroup.value`, this.editArticleFormGroup.value);
        /* Yes. Category as object. good.
        articleCategory_formControlName: {
value: "politics"
viewValue: "Politics" }

         */
        /* Q. Curious. Why is Category retained? (I know why URL is not.) Hmm.
        A. Ah-hah-ho. It is the damned DEFAULT value. Yeesh. (We in fact LOSE our original value, e.g. 'U.S.")

        {articleTitle_formControlName: "Coronavirus 234 Live Updates: Birx Urges Bar Closures and Limits on Gatherings", articleUrl_formControlName: null, articleCategory_formControlName: "News"}
         */

        /*
        Q. Hmm, is this "navigate" necessary ? don't think so. may put in again, or similar. cheers
        A. No. not really needed.

                this.myRouter.navigate(['/']); // navigate away from this page after EDIT Submit() ...
        */

        let myFormFieldsAndFiles: any; // << FormData, but, tricky, so 'any' helps ...
        /*
Phase I. Just FormFields
Phase II. Files too (for Photo(s))
         */

        myFormFieldsAndFiles = this.prepareToEditArticleReactiveForm();

        // const idToPass: string = '5af746cea7008520ae732e2c'; // << Yes of course hard-coded works...
        // const idToPass: string = this.articleHereInDetailPage.articleId_name.value; // << Ooffa. FE convention, not in use at this moment! oi.
        // const idToPass: string = this.articleHereInDetailPage._id.value; // << oi. don't look for ".value"
        const idToPass: string = this.articleHereInDetailPage._id; // << Here you want the (lazy) BE convention. sheesh.
        console.log('WTF & Etc. this.articleHereInDetailPage ', this.articleHereInDetailPage);
        /* Hmm. Ok, we can here LOOK at this "articleHereInDetailPage",
        but we are not really DOING anything with it, right here. Hmm.
        {
        articleCategory: "politics" // <<<<<<<<<< N.B. The BE stored .value.  Ok. no biggie.
articleTitle: "How Has Donald Trump Survived?"
articleUrl: "https://www.nytimes.com/2020/08/31/books/review/donald-trump-v-the-united-states-michael-s-schmidt.html"
__v: 0
_id: "5f554ebb4d2835ae66510f48"
}
         */
        /* Yeah, we have _id:
        articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "myhttp"
__v: 0
_id: "5af746cea7008520ae732e2c"
         */

        console.log('myFormFieldsAndFiles ', myFormFieldsAndFiles);
        /* Does Not Work in console.log()
        FormData {}
        __proto__: FormData

         */

        this.goEditArticle(idToPass, myFormFieldsAndFiles);
        // Better name: go UPDATE Article ...

        // ****   FORM for EDIT MODE  **********
    } // /processReactiveFormEdit()

    private prepareToEditArticleReactiveForm(): FormData {
        /*
        - 1. "Prepare" here means:
           Appends values from form fields onto our
           HTML "FormData" type

        - 2. A sort of "mapping" occurs, from:
           - naming convention for form fields "_formControlName", to:
           - naming convention for FE Article "_name"
           (Note that there will be another "mapping"
           later, from the FE convention, to the BE
           convention, for sending to the BE/API/DB.)
           BE drops the "_name" (e.g. articleTitle)

        - 3. Returns that FormData.
        */

        console.log('o la prepare EDIT 00 this.editArticleFormGroup.controls[\'articleTitle_formControlName\'].value ', this.editArticleFormGroup.controls['articleTitle_formControlName'].value);
        /* YES
        Trump’s Uncle Brendan WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers
         */

        this.myFormFieldsData.append(
            'articleTitle_name',
            this.editArticleFormGroup.controls['articleTitle_formControlName'].value
        );

        this.myFormFieldsData.append(
            'articleUrl_name',
            this.editArticleFormGroup.controls['articleUrl_formControlName'].value
        );

        this.myFormFieldsData.append(
            'articleCategory_name',
            this.editArticleFormGroup.controls['articleCategory_formControlName'].value.value // <<<<<<<<<< just send the 'value', not the whole Category object. WUL
            /* e.g. we want just the string 'news'
            { value: 'news', viewValue: 'News' }
             */
        )

        console.log('o la. prepare EDIT this.myFormFieldsData: ', this.myFormFieldsData); // hmm. FormData {}
        /* YES we do have the data here. very good.
        O la. Need that XHR-2-FAKE.URL to debug FormData, people. sigh.
        -- OR --
        just (lazily) use that Chrome DevTools Network Headers FormData:
        -----
        NEWER EXAMPLE:
        ===========
        ------WebKitFormBoundarylxMomW0gcyaEVcOo
Content-Disposition: form-data; name="articleTitle_name"

How Has Donald Trump Survived? I mean Really.
------WebKitFormBoundarylxMomW0gcyaEVcOo
Content-Disposition: form-data; name="articleUrl_name"

https://www.nytimes.com/2020/08/31/books/review/donald-trump-v-the-united-states-michael-s-schmidt.html
------WebKitFormBoundarylxMomW0gcyaEVcOo
Content-Disposition: form-data; name="articleCategory_name"

[object Object] // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< !!
------WebKitFormBoundarylxMomW0gcyaEVcOo--
        ===========




        OLDER EXAMPLE:
        ------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleTitle_name"

Trump’s Uncle Brendan WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers
------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleUrl_name"

null
------WebKitFormBoundaryfNJTOZUW1y6QoaUw
Content-Disposition: form-data; name="articleCategory_name"

News
------WebKitFormBoundaryfNJTOZUW1y6QoaUw--
        -----
      */

        return this.myFormFieldsData;
    } // /prepareToEditArticleReactiveForm()

    goEditArticle(idPassedIn, myFormFieldsAndFiles): void {
        /*
            - 1. "Go Edit" here really means Go UPDATE:
                   Go to the Service
                   (which in turn does XHR to the BE API)
                   to UPDATE ("Edit") the Article
                   on the BE/DB

            - 2. No 'return' (void)
         */

        // TODONE There'll be a SPINNER "#2", triggered from here, arguably.
        //        But the spinner-related code is elsewhere: ArticleService, and this Component's template.
        this.myArticleService.updateArticle(idPassedIn, myFormFieldsAndFiles)
            .subscribe(
                (whatWeGotBackFromUpdate) => {
                    console.log('990 whatWeGotBackFromUpdate BE ', whatWeGotBackFromUpdate);
/*
{
articleCategory: "[object Object]" // <<<<<<<<<<<<<<<<<<<<<<<<<
articleTitle: "How Has Donald Trump Survived? I mean Really."
articleUrl: "https://www.nytimes.com/2020/08/31/books/review/donald-trump-v-the-united-states-michael-s-schmidt.html"
__v: 0
_id: "5f554ebb4d2835ae66510f48"
}
 */

// ****  1) RESET FORM ! ************* PRIOR to setTimeout() is OK
                    // Also can be inside setTimeout(), but better before.
                    this.editArticleFormGroup.reset();

                    setTimeout( // EDIT ARTICLE
                        /* N.B. setTimeout() is HERE in calling Component.
                        NOT over in (called) ArticleService.
                        cf. createArticleB() which has its setTimeout()
                        over in the Service.
                        Q. Why different here?
                        A. For EDIT we navigate back to same page,
                        in Display mode. Needed more control, via
                        setTimeout(), of when 1) form.reset() occurs,
                        and more importantly 2) when .navigate() occurs.
                        (For CREATE Article the form merely resets - no issues)
                        But the .navigate() on EDIT caused errors,
                        esp. re: our famous Category Select with
                        its compareWith() biz. cheers.

                         */
                        () => {
                            this.myStore.dispatch(new UIActions.StopLoading());

// ****  2) NAVIGATE !  ********** << INSIDE the SetTimeout() OK
                            this.myRouter.navigate([`/articles/${idPassedIn}`]); // back to page we just edited

                            // ??? NO RETURN ?? apparently fine
                        },
                        1000);

                    /*
                    I'd (apparently) forgotten this ( ? ). To "turn off editing" here!
                    Tell NgRx Store!

                    Q. Where (pray tell?) was I doing this, before?
                    Could swear I saw the ArticlesComponent "header" properly showing:
                    "(Editing) <!--NGRX (weAreEditingObservable$ = true)-->"
                    Hmm.

                    A. Dummkoppff. oi. I (once again (apparently)) got confused (wotta concept)
                    on what status really needs to be dispatched & Etc.
                    It is not so much "turning editing off" here. Here, we are about to
                    navigate away, which will Destroy this Component, and in OnDestroy
                    don't worry about it - we've got the "dispatch ... false" all taken care of.
                    So no, not here was I missing or lacking a "dispatch ... false" about editing. No.
                     */
                    /*
What DID need fixing was over in ArticlesComponent, where I'd missed updating one check
on "ArticleDetailTWOComponent" - for this "are we editing" biz.
Found in myOnActivate() ...
All Set Now!
 */
                    // So, per above discussion, this is Not Needed Right Here:
                    // this.myStore.dispatch(new UIActions.TellingYouIfWeAreEditing({areWeEditingInAction: false}));

                },
                (errWeGot) => {
                    console.log('updateArticle. errWeGot ', errWeGot);
                    console.log('updateArticle. errWeGot.message ', errWeGot.message);
                },
                () => {
                    console.log('updateArticle. complete. that\'s it. eom.');
                }
            ); // /.subscribe()

    } // /goEditArticle()

    letUsDelete() {
        const idToDelete = this.articleHereInDetailPage._id;
        if(confirm('Are you sure you want to Delete?')) {
            this.myArticleService.deleteArticle(idToDelete)
                .subscribe(
                    (whatIGotDeleting) => {
                        console.log('whatIGotDeleting ', whatIGotDeleting); // null  hmm. << again! wtf
                        /* Better!
                        {
                        articlePhotos: ["["sometimes__1527882425725_09dc-Autos-1-jumbo.jpg"…_fbde38d7-df32-4801-9c88-c9111e7084d7-jumbo.jpg"]"]
articleTitle: "gtyhbnmmj888888"
articleUrl: "null"
__v: 0
_id: "5b11a2bac21542eb8a213c18"
                        }
                         */

                        this.myRouter.navigate(
                            ['/articles'],
                            {
                                state: {
                                    data: {
                                        articleMostRecentHideRouterLinkState: false
                                    }
                                }
                            }
                        );

                    },
                    (errIGotDeleting) => {
                        console.log('errIGotDeleting ', errIGotDeleting)
                    },
                    () => {
                        console.log('Deleting, complete()'); // << yep
                    }
                );
        }
    }

    letUsCancelEditing() {
        console.log(this.articleHereInDetailPage);
        /* RECALL: "BE" Naming Convention!

        articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s show me show me show me EDITED THE HELL BACK OUT (that's better) OFFICE WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONES,lopTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "null"
__v: 0
_id: "5af746cea7008520ae732e2c"
         */

        /* NO. Not "FE" Naming Convention....
                    this.myRouter.navigate([`/articles/${this.articleHereInDetailPage.articleId_name.value}`]);
        */

        // YES. "BE" Naming Convention:
        this.myRouter.navigate([`/articles/${this.articleHereInDetailPage._id}`]);

    }

// **********  UTILITIES  *****************
    myHowManyCharsTyped(formControlNamePassedIn: string):number {
        let howMany;
        /*
        Clever little code: boolean expression both must be true/truthy "&&"
        - test whether there IS any "value" (string) in that FormControl, right now
        - get its length. that's what you're sending back. cheers
         */
        howMany = (
            this.editArticleFormGroup.get(formControlNamePassedIn).value
            &&
            this.editArticleFormGroup.get(formControlNamePassedIn).value.length
        );
        return howMany;
    }

    // Now in our DateService (under /core/services)
/* NOT CALLED FROM HERE
    // https://steveridout.github.io/mongo-object-time/
    myDateFromObjectId = function (objectId): Date {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    myObjectIdFromDate = function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
    };
*/
    myFullDateFromObjectId = (objectIdPassedIn): Date => {
        return this.myDateService.myDateFromObjectIdFunctionTerm(objectIdPassedIn);
    }

    myFormattedStringDateFromObjectId = (objectIdPassedIn): string => {
        return this.myDateService.myStringDateFromObjectIdFunctionTerm(objectIdPassedIn);

        /* WebStorm all complainy:
"Local variable 'myFormattedStringDateToReturn' is redundant"
Better the one-liner above.
cheers

        const myFormattedStringDateToReturn = this.myDateService.myStringDateFromObjectIdFunctionTerm(objectIdPassedIn)
        return myFormattedStringDateToReturn;
*/
        /* DATE FORMAT we are using:
          stringDateToReturn = momentINeed.format('ddd MMMM Do, YYYY'); // Thu August 20th, 2020
          https://momentjs.com/
         */
    } // /myFormattedStringDateFromObjectId()



    ngOnDestroy() {
        /* using (again) now */
        this.areWeEditing = false;


        // Will try first here in ngOnDestroy() of (child) ArticleDetailComponent
        // instead of over in (parent) ArticlesComponent
        this.myStore.dispatch(new UIActions.TellingYouIfWeAreEditing({areWeEditingInAction: false}));

    }

    getArticleORIGOLD() { // << ********* NOT CALLED !    SEE getArticle() instead, friends

        this.urlHereToSeeWhetherEditingObservable$.subscribe(
            /*
            (above) got initialized in the constructor(), off the ActivatedRoute 'url'
            Here in .getArticle() immediately called in ngOnInit(),
            we (apparently) can immediately .subscribe() to it, get that URL.
            Goal is to test: "Does it contain /edit at the end ?"
            From that we set "areWeEditing" to T or F. bueno.
            cheers
             */

            (urlFromActivatedRoute) => {
                console.log('GetArticle. .Subscribe. off urlHere$. we get: urlFromActivatedRoute ', urlFromActivatedRoute); // << YES. Finally works. 5af746cea7008520ae732e2c
                this.urlHereToSeeWhetherEditingBehaviorSubject$.next(urlFromActivatedRoute);
                this.urlHere = urlFromActivatedRoute; // whamma-jamma. ok.
                // console.log('blah. SUBSCRIBE this.urlHere ', this.urlHere); // YES. 5af746cea7008520ae732e2c/edit
                // REGEX TIME
                if (this.urlHere.match(/\/edit$/g)) {
                    // https://regexr.com/  https://regex101.com/  :)
                    console.log('RegEx WORKS - we are EDITING');

                    /*  ===   NGRX STUFF
Hmm, is this point, where we *just got* the logic of '/edit' off the URL,
     is this point "too early" ( ? ) to do this Store Action Dispatch ? (Hmm, why would it be?)
Should I instead do it further along, where the EventEmitter did its .emit() ? (Hmm)
(That "further along" point is near the end of .getArticle(). Same place we .dispatch() the article ID to the Store. cheers)

This seems to be working FINE for the FIRST time through, but navigating to bring up a 2nd
ArticleDetail to "edit" seems to be not quite right. May be owing to "this point" vs. another,
May just be something else. W-I-P.


---  2020-07-24   ----------------------
Ah-hah. Hmm. Looks like YEAH we should move this Store Action Dispatch down below (near the other .emit()) cheers
-------------------------
core.js:6228 ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
Previous value: 'undefined'. Current value: 'false'.
It seems like the view has been created after its parent and its children have been dirty checked. Has it been created in a change detection hook?
-------------------------



btw, related question: just *where/when* do we .dispatch the FALSE action that we are No Longer Editing, hey?
For now: in the (parent) ArticleComponent's ngOnDestroy() ? hmm
Soon-(ish): Or of course (in (near) future), could be off the (not yet created) <form> submit from the ArticleDetailComponent in "editMode". Guess that would be a .dispatch to the Store, which would of course get read/known/updated
in the (parent) ArticlesComponent, which would then "do the right thing" to hide the "(Editing)" nav tab bar thing. cheers.
                     */

                    // !!!  TOO  EARLY !!! //
                    /*
                                        this.myStore.dispatch(
                                            new UIActions.TellingYouIfWeAreEditing(
                                                { areWeEditingInAction: true} // AH-HAH moment. Got to match the danged constructor signature, kids!
                                            )
                                        );
                    */
                    /*
                    above, "Too Early" for NgRx Store Dispatch. OK.
                    But right here, NOT "too early" to simply
                    capture to local Boolean class member
                    that yeah, "we are editing," because
                    we just tested that the URL does contain
                    '/edit'
                    cheers
                    (that is, you'll see below we test on this
                     flag when we go to Dispatch to Store.)
                     */
                    this.areWeEditing = true;

                    // =================================================
                    /* NO LONGER (GOING TO BE) USED. NGRX instead
                                        this.areWeEditing = true; // << YES this logic works, etc. bueno.
                    */
                    // Above is used LOCALLY here on the ArticleDetailComponent HTML as flag

                    // Take FOUR: << NO. >>  ("the charm") :)? << NO. Hitting dumb error "Expression Changed" = TOO SOON.
                    // Below is used to SEND TO PARENT that we are editing,
                    // to disable that "Edit Article" link up on ArticlesComponent
                    /* NOT HERE
                                        this.weAreEditingNow.emit(true);
                    */
                    // SENDING TO PARENT ARTICLES.COMPONENT
                    // =================================================
                    /* As with other case of this, hit error, but the value does come through: 'true' o well
                    Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
    at throwErrorIfNoChangesMode
                     */

                } // /if() REGEX

                // ?? Do we need to return anything?  Didn't break stuff having it return. Hmm.
                return urlFromActivatedRoute;
            }
        ); // /.subscribe() urlHere...Editing$

        this.urlHereAsObservableFromBehaviorSubject$.subscribe(
            (urlWeFinallyGotIHope) => {
                console.log('urlHereAsObservableFromBehaviorSubject$.subscribe -- urlWeFinallyGotIHope ', urlWeFinallyGotIHope);
                // << YES. Finally works. 5af746cea7008520ae732e2c
                this.urlHere = urlWeFinallyGotIHope;
                // .
            }
        )


        this.myActivatedRoute.params.subscribe(
            (paramsIGot) => {

                const articleIdHereInDetailPage = paramsIGot['article_id'];

                this.myArticleService.getArticle(articleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot: any) => {
                            console.log('9999 getArticle. articleIGot: BE naming convention: ', articleIGot);
                            /* Yep:  BE NAMING CONVENTION
articlePhotos: Array(1) 0: "["justsomestring-in-an-array"]"
articleTitle: "Trump’s WAYZO Gots to ...Rollbacks Will Hurt Drivers"
articleUrl: "myhttp",
articleCategory: "living", // << e.g. 'value' (correct). Not 'viewValue' e.g. 'Living'. okay
_id: "5af746cea7008520ae732e2c"
                             */

                            this.articleHereInDetailPage = articleIGot; // BOOM. whamma-jamma
                            /* N.B.
                            e.g. BE-to-FE Conversion: << we are NOT doing, here
                              articleTitle_name: whatIGot[0].articleTitle,
                              ^^^^^^^^^^^^^^^^^              ^^^^^^^^^^^^
                              FE                             BE
                             */

                            /* CATEGORY FIXER
We *DO* still need to convert the Category DB-stored 'value'
                            to the U/I presentation 'viewValue'.
                            e.g. 'u.s.' to become 'U.S.'
                             */
                            let categorySuchAsItIsReturned: string;
                            categorySuchAsItIsReturned = this.myArticleService.getCategoryViewValue(articleIGot.articleCategory); // e.g. 'U.S.' or 'World'
                            // console.log('articleIGot.articleCategory ', articleIGot.articleCategory); // yes. e.g. 'u.s.' or 'world'
                            // console.log('categorySuchAsItIsReturned: ', categorySuchAsItIsReturned); // yes! World
                            this.articleHereInDetailPage.articleCategory = categorySuchAsItIsReturned; // yes. okay. whamma-jamma one field
                            console.log('1111B getArticle. this.articleHereInDetailPage: CATEGORY FIXER? ', this.articleHereInDetailPage);
                            /*
                            articleCategory: "Living" // << Yep "viewValue"
                             */


                            /* ========================================
                               *  NGRX  *
                               * Instead of .emit(), we'll use
                               *  Store.dispatch()
                             */
                            this.myStore.dispatch(new UIActions.TellingYouMyId(
                                {myIdIsInAction: articleIdHereInDetailPage}
                            ));

                            /* Seen in Redux Tool: yes the Action data look good:
                              {
                                 myPayload: '5af746cea7008520ae732e2c',
                                 type: '[UI] Telling You My Id'
                               }
                             */

                            // THEN, THE ARTICLES.COMPONENT WILL
                            // "SELECT" IT TO OBTAIN OBSERVABLE
                            // TO ITS VALUE. :o)


                            // Take FIVE: ("the charm") :)?
                            // Below is used to SEND TO PARENT that we are editing,
                            // to disable that "Edit Article" link up on ArticlesComponent

                            /* No Longer
                                                                                if (this.areWeEditing) { // << But, need to check difference between /:_id and /:_id/edit !
                            */

                            /* NO LONGER NOW NGRX
                                                                                    this.weAreEditingNow.emit(true);
                                                                                    // SENDING TO PARENT ARTICLES.COMPONENT
                            */
                            /* No Longer
                                                                                } // /if()
                            */
                            /*
                            What Ho! Re-Instating the "Take FIVE"
                            (Take SIX, hey?)
                            That is, we have (once again)
                            learned the Hard Way that the
                            timing for this Store Dispatch
                            (which in turn updates our Observable$)
                          needs to be here, later, not
                          so immediately, as we first tried
                           up above, at beginning of getArticle().
                           Note how we set up that Observable$
                           v. early in constructor() (normal)
                           But something about router-outlet
                           onActivate() ? and this same
                           Component getting re-used/loaded ?
                           for shifting to /edit mode causes
                           too much too early (re)-updating
                           of that Observable etc etc
                           Fix seems to be: delay all that
                           updating by finally only doing it way
                           down here, when the Article has been
                           re-retrieved ? for editing.
                           o la.
                             */
                            if (this.areWeEditing) {
                                /*
                                We need to test for this;
                                we've captured the boolean
                                up above when we looked at the
                                URL for '/edit'
                                 */
                                this.myStore.dispatch(
                                    new UIActions.TellingYouIfWeAreEditing(
                                        {areWeEditingInAction: true}
                                    )
                                );
                            }
                            // =================================================

                            /* ***********************************
                                FORM EDIT
                                PatchValue
                                https://angular.io/api/forms/FormControl#patchvalue
                                **********************************
                             */

                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: articleIGot.articleTitle,
                                articleUrl_formControlName: articleIGot.articleUrl,
                            });
                            // N.B. Above - "BE" convention: articleIGot.articleTitle, not FE: articleTitle_name. cheers
                            //                                                                             ^^^^^

                            // NEW. Let's add editing the damned CATEGORY
                            console.log(' @ PATCHVALUE articleIGot.articleCategory "twiggery"? hmm ', articleIGot.articleCategory); // << Yep. ??? IS THIS TRUE ??? 'Living' ???  << nah, just console.log() twiggery. This bad boy is really just 'living' I am like 99% sure.
                            console.log(' @ PATCHVALUE categorySuchAsItIsReturned ', categorySuchAsItIsReturned); // << Yep.  'Living'

                            // Yes: << ? in what sense, "Yes"? Huh?
                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(this.selectedCategoryToEdit, { onlySelf: true });

                            console.log('XXX this.editArticleFormGroup ', this.editArticleFormGroup);
                            /* STRANGE. Here you DO find the Category... << hmm, do I ? o la << yes, I do! o la 2
                            HMM. null first time? Displaying, not Editing. // <<<<<<<<<<<<<<<
                            HMM 2. undefined now - Editing. Hmm. // <<<<<<<<<<<<<<<<<<<<<<<<<

                            FormGroup {validator: null, asyncValidator: null, pristine....
                            articleCategory_formControlName: {value: "living", viewValue: "Living"}
                            articleUrl_formControlName: "https://www.nytimes.com/live/2020/08/17/us/dnc-convention"
                            articleTitle_formControlName: "As Colleges Move Classes Online, Families Rebel Against the Cost"
                             */

                            console.log('XXXZZZ this.editArticleFormGroup.getRawValue() ', this.editArticleFormGroup.getRawValue());
                            /* HELL. Here, it's UNDEFINED
                            {articleTitle_formControlName: "As Colleges Move Classes Online, Families Rebel Against the Cost",
                            articleUrl_formControlName: null,
                            articleCategory_formControlName: undefined} // <<<<<<<<<<<<<<< Displaying. Editing too ?? <<<<<<< YAR. Editing too. At least this time. Sheesh.
                             */

                            console.log('XXXYYY this.editArticleFormGroup.controls[\'articleCategory_formControlName\'] ', this.editArticleFormGroup.controls['articleCategory_formControlName']);
                            /* FormControl (for CATEGORY)
                            value: undefined // <<<<<<<<< Displaying
                            value: undefined // <<<<<<<<< Editing too, at least this time. Sheesh.
                             */


                            /* Oh boy.
                            https://stackoverflow.com/questions/39105905/angular-2-bind-object-to-dropdown-and-select-value-based-on-an-event
                             */
/* THESE 3 LINES DON'T DO ANYTHING.
                            let localCategoryToBeSelected: Category;
                            localCategoryToBeSelected = this.localGiveMeFullCategoryObject(categorySuchAsItIsReturned);
                            console.log('localCategoryToBeSelected ', localCategoryToBeSelected);
*/
                            /* YES.
                               {value: "living", viewValue: "Living"}
                             */

                            /* ***********************************
                                 /FORM EDIT
                               **********************************
                            */

                        } // /next(articleIGot)
                    ); // /.subscribe()  ...Service.getArticle()
            }) // /.subscribe()  myActivatedRoute.params
    } // /getArticleORIGOLD()


}
// ARTICLE-DETAIL-TWO.COMPONENT.TS
