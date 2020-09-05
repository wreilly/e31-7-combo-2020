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

        // console.log('Custom Error Matcher! this.categoriesHereInMatcher ', this.categoriesHereInMatcher);
        // Yes, all 8 Categories. bueno
        /*
        0: {value: "news", viewValue: "News"}
1: {value: "world", viewValue: "World"} ...
         */

        let categoryFoundAmongOptions: Category;
        // let categoryIsAmongOptionsOK = true; // init
        let categoryIsAmongOptionsOK = false; // init ORIG

        categoryFoundAmongOptions = this.categoriesHereInMatcher.find(
            (eachCategory) => {

                console.log('777A eachCategory ', eachCategory);
                /* Yeah:
                     {value: "world", viewValue: "World"}

Okay, so the the "predicate" handed in to the Array.find()
method (which I've named "eachCategory")
is the entire Category object (above) ... Good.
 */

                console.log('777 control.value ', control.value); // 'U.S.' <<< HMM! SHOULDN'T THIS BE 'u.s.'??? << I have corrected this.
                /*
                Corrected above over in ArticleService in the
                "myMapBEArticlesToFEArticles()"
                where I now *preserve* the BE _value_ for Category
                e.g. 'politics'

                Note however:
                1. - Normal. BE Category is one of the options. OK. 'u.s.'
                2. - Empty. BE Category is simply NOT a Property at all on BE. OK.
                3. - Dis-Allowed Value. BE Category is some string like "No Category etc.", or "foobar". Hmmph.
                 */
                /*
                ...whereas the "control.value" turns out
                to be:
                 - NOT that entire Category object
                 - Instead, just the "view value" in the
                control.  That is, the part the user sees in the
                U/I for this select form field, e.g. 'World'
                (even though behind the scenes the select options
                are populated from an array of Category objects
                including {value: 'world', viewValue: 'World') )
                 */
                // console.log('777B control.status ? ', control.status); // VALID


/* I had it wrong:
                return control.value === eachCategory;
*/
/* I had it wrong again:
                return control.value === eachCategory.viewValue;
*/
                return control.value === eachCategory.value;
            }
        ) // /.find()

        console.log('categoryFoundAmongOptions straight-up ', categoryFoundAmongOptions);
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


            console.log('000a ******************');
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
            console.log('000b ******************');

            /* Category Control
            If I get here, the category value is either:
            - undefined because it was empty
            - undefined because it is spurious/wrong data, not allowed value

            Either way, looking to Invalidate the Control, hence the Form!
            Here's hoping "touch" does the trick. << NOPE
            Had to WHACK the data. See above.
            WUL.
             */
        }

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
        console.log('control ', control);
        /*
        FormControl {asyncValidator: null, pristine: true, ...
         */
        console.log('control.invalid ', control.invalid); // false
        console.log('control.dirty ', control.dirty); // false
        console.log('control.touched ', control.touched); // false
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

    } // /isErrorState()
} // /myCustomCategorySelectErrorStateMatcher {}

@Component({
    selector: 'app-article-detail-two',
    templateUrl: 'article-detail-two.component.html',
    styleUrls: ['article-detail-two.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArticleDetailTwoComponent),
            // multi: true,
        }
    ],
})
export class ArticleDetailTwoComponent implements OnInit, OnDestroy, ControlValueAccessor {

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

    myFormFieldsData: FormData = new FormData();

    editArticleFormGroup: FormGroup;
    articleTitle_formControl: FormControl;
    articleUrl_formControl: FormControl;
    articleCategory_formControl: FormControl;

    myOwnErrorStateMatcher: MyErrorStateMatcher; // << imported ! very nice.
    myOwnCustomCategorySelectErrorStateMatcher: myCustomCategorySelectErrorStateMatcher;

    public categories: Category[]; // << from ArticleService now. :o)


    // ****   /FORM for EDIT MODE  **********

    urlHereToSeeWhetherEditingObservable$: Observable<string>; // works with | async; must .subscribe() to get at its value in TS logic

    urlHereToSeeWhetherEditingBehaviorSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('FAKEURL-INITIALVALUE-BEHAVIORSUBJECT');
    urlHereAsObservableFromBehaviorSubject$ = this.urlHereToSeeWhetherEditingBehaviorSubject$.asObservable();

    urlHere: string;

    areWeEditingObservable$: Observable<boolean>;
    areWeEditing = false;

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

        this.myOwnErrorStateMatcher = new MyErrorStateMatcher(); // << imported.
        this.myOwnCustomCategorySelectErrorStateMatcher = new myCustomCategorySelectErrorStateMatcher(this.myArticleService);

        // TODO this.myUIIsLoadingStore$ = this.myStore.select(fromRoot.getIsLoading);


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
                            /* Example that Yeah Does Have Category.... (but no Photos, mind!) - another day
{_id: "5f3bc1b45f54a09d485800ca",
articleUrl: "https://www.nytimes.com/2020/08/17/opinion/trump-contested-election-protests.html",
articleTitle: "Trump Might Cheat. Activists Are Getting Ready.",
articleCategory: "politics",  // << BE convention.  'value', not 'viewValue'. Good.
__v: 0}
                             */

                            let categoryViewValueSuchAsItIsReturned: string;
                            categoryViewValueSuchAsItIsReturned = this.myArticleService.getCategoryViewValue(articleIGot.articleCategory); // e.g. 'U.S.' or 'World'. Also handles **NO** Category
                            console.log('WWW3 categoryViewValueSuchAsItIsReturned ', categoryViewValueSuchAsItIsReturned);
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

                            /* Oi!
                            Finally fix this damned bug.
                            When **NO** Category, get that default value
                            to say so (lines above), and then,
                            here (below), STICK IT ONTO
                            our "articleHereInDetailPage" fer chrissake
                             */
                            this.articleHereInDetailPage.articleCategory = articleIGotWithFECategory.articleCategory_name;


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


                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(categoryViewValueSuchAsItIsReturned, { onlySelf: true }); // << you're setting a type: string. (But, note! - this puts the ViewValue on! (not what we want) 'Politics' not 'politics'. Oi!

 // Yes:
 /* .setValue() OK, but I prefer .patchValue() y not
                            this.editArticleFormGroup.get('articleCategory_formControlName').setValue(this.selectedCategoryToEdit, { onlySelf: true });
 */
                            this.editArticleFormGroup.get('articleCategory_formControlName').patchValue(this.selectedCategoryToEdit, { onlySelf: true });


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
/* WORKS TOO. LOVELY.*/
                            this.editArticleFormGroup.patchValue({
                                articleTitle_formControlName: articleIGot.articleTitle, // 'DEFAULT TITLE HEY?',
                                articleUrl_formControlName: articleIGot.articleUrl,

                                articleCategory_formControlName: articleIGot.articleCategory, // 'politics' << NO. Now it is 'Politics' sigh ?
                                 });


/* SEEMINGLY N-O-T. Harrumph. ??
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


    myCompareOptionCategoryValues(optionCategory1: any, optionCategory2: any): boolean {
        // myCompareOptionCategoryValuesTERNARYTHISWORKS
        // myCompareOptionCategoryValuesORIGINALTERNARY
        console.log('COMPARE 1 optionCategory1 ', optionCategory1); // u.s., or news etc.   BE value
        console.log('COMPARE 1.value optionCategory1.value ', optionCategory1.value); // undefined
        console.log('COMPARE 2 optionCategory2 ', optionCategory2);
        /*
        U.S. <<<<< HMM! SHOULDN'T THIS BE 'u.s.' ???

        Hmm. Why (the hell) is it 'U.S.'
        the viewValue, and not 'u.s.'
        the value
        ???
         */

        return optionCategory1 && optionCategory2 ? optionCategory1 === optionCategory2 : optionCategory1 === optionCategory2;
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
        /* Yeah, we have _id:
        articlePhotos: ["["justsomestring-in-an-array"]"]
articleTitle: "Trump’s WAYZO Gots to go 3345 Twice BAZZhhhhARRO  We Love The Donald older Ye Olde Edite HONESTLY REALLY CRAZY VERY INEFFICIENT Fuel Efficiency Rollbacks Will Hurt Drivers"
articleUrl: "myhttp"
__v: 0
_id: "5af746cea7008520ae732e2c"
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
            this.editArticleFormGroup.controls['articleCategory_formControlName'].value
        )

        console.log('o la. prepare EDIT this.myFormFieldsData: ', this.myFormFieldsData); // hmm. FormData {}
        /* YES we do have the data here. very good.
        O la. Need that XHR-2-FAKE.URL to debug FormData, people. sigh.
        -- OR --
        just (lazily) use that Chrome DevTools Network Headers FormData:
        -----
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

        this.myArticleService.updateArticle(idPassedIn, myFormFieldsAndFiles)
            .subscribe(
                (whatWeGotBackFromUpdate) => {
                    console.log('whatWeGotBackFromUpdate BE ', whatWeGotBackFromUpdate);

                    /* TODO (maybe)
                    BE-to-FE convert, to DISPLAY result on FE << NAH

                    -- OR --
                    just navigate away from this page ? T.B.D. << YAH
                     */

                    this.editArticleFormGroup.reset(); // << hmm. not what we want ?
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



                    this.myRouter.navigate([`/articles/${idPassedIn}`]); // back to page we just edited

                },
                (errWeGot) => {
                    console.log('updateArticle. errWeGot ', errWeGot);
                    console.log('updateArticle. errWeGot.message ', errWeGot.message);
                },
                () => {
                    console.log('updateArticle. complete. that\'s it. eom.');
                }
            );

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
