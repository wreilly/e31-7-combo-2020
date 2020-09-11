import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUI from '../../shared/store/ui.actions'; // dispatch for sure
import * as fromRoot from '../../store/app.reducer'; // select too? prob.
import {Observable} from "rxjs";
import { tap } from 'rxjs/operators';

import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";


// https://grensesnittet.computas.com/dynamic-themes-in-angular-material/
import {ThemeService} from "../../core/services/theme.service";
import { ScrollService } from '../../core/services/scroll.service';
import { DebugDevelService } from '../../core/services/debug-devel.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

    myShowLabelsStore$: Observable<boolean>;
    myDarkThemeStore$: Observable<boolean>;

    isThemeDarkInComponent: boolean;
    scrollOffsetWeJustGotToDisplay: number;
    scrollPositionRounded: number;

  @Output('myToggleMatSidenavEventEmitterHeaderName') myToggleMatSidenavEventEmitterHeader: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  myIsMatSidenavOpenFromParentApp: boolean;

    constructor(
      private myThemeService: ThemeService,
      private myScrollService: ScrollService,
      private myScrollDispatcher: ScrollDispatcher,
      private myZone: NgZone,
      private myStore: Store,
      private myDebugDevelService : DebugDevelService,
  ) { }

  ngOnInit(): void {

/* Now NGRX (j'espere)
No longer running this onInit() first go to set its value.

      this.onLabelShowHideChange(false);
*/
      this.myShowLabelsStore$ = this.myStore.select(fromRoot.getShowLabels);
      /* NgRx (both Header and Sidenav)
Yes, we need above line. We use it here in Component
to correctly have the mat-checkbox show checked or not.
    We do *not* make use of this property here in
    Component to drive logic whether Component Labels
    are shown or hidden. That logic is over in Service.
 */

      // NgRx for "DarkTheme" (or not)
      this.myDarkThemeStore$ = this.myStore.select(fromRoot.getThemeDark);

      // ABOUT TO COMMENT OUT. Now NgRx instead
      this.myThemeService.isThemeDarkInServiceObservable
          .subscribe(
              (whatIGot) => {
                  console.log('OnInit. ThemeDark subscribe whatIGot: boolean - ', whatIGot);
                  this.isThemeDarkInComponent = whatIGot;
              }
          )


 /*
  Do Note: We have (long) since REMOVED the "scroll biz" from the HeaderComponent Template. So, Not Using this! okay.
 */
      this.myScrollService.scrollOffsetInServiceObservable
          .subscribe(
              (scrollOffsetWeGot) => {
                  // console.log('HEADER 00 OnInit. Scroll Offset (of the moment) be: ', scrollOffsetWeGot);
                  this.scrollOffsetWeJustGotToDisplay = scrollOffsetWeGot;
                  // console.log('HEADER 01 OnInit. this.scrollOffsetWeJustGotToDisplay ', this.scrollOffsetWeJustGotToDisplay);
                  // this.showToTopIfScrolled(scrollOffsetWeGot);
              }
          )

      /* ngOnInit() in DebugDevelService ?
          NO. Not in a Service
https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
Give this a go: << Working!
"@Thom - you can add a regular public init() method on your service, import the service and call it from your AppComponent's ngOnInit() – Joe Hanink Oct 28 '19 "
 */
      this.myDebugDevelService.myOwnInitForService();
      /* See also long-ish Comment in SidenavComponent
      ngOnInit()
      I there deliberate: Hmm, should this DebugService's
      "ownInit()" be called by BOTH these Components?
      Good? Bad? discuss.
       */

      this.myThemeService.myOwnInitForService();
      // Above has Service do Store.select to get ThemeDark listener too...
      // Just like we do here  in this Component.

  } // /ngOnInit()

    ngAfterViewInit() {
        /* NEW   COPIED HERE FROM SCROLL-TOP.COMPONENT.
        Kinda crazy to run there, and here.
        https://stackoverflow.com/questions/46996191/how-to-detect-scroll-events-in-mat-sidenav-container
         */
        /*
        Do Note: We have (long) since REMOVED the "scroll biz" from the HeaderComponent Template. So, Not Using this! okay.
         */
        this.myScrollDispatcher.scrolled(100)
            .subscribe(
                (cdkScrollDataWeGot: CdkScrollable) => {
                    this.myZone.run(
                        () => {
                            const scrollPosition = cdkScrollDataWeGot.getElementRef().nativeElement.scrollTop; // undefined for 'cdkScrollDataWeGot' :o(
                            // console.log('999888 HEADER YOWZA? scrollPosition ', scrollPosition);
                            this.scrollOffsetWeJustGotToDisplay = scrollPosition; // whamma-jamma?

                            // DO MATH ROUNDING BIT HERE (for now)
                            this.scrollPositionRounded = Math.round(scrollPosition);
                            // console.log('YYY this.scrollPositionRounded ', this.scrollPositionRounded);

                        }
                    )
                }
            )
    } // /ngAfterViewInit()


    onThemeChange(checkedOrNot: boolean) {
      this.myThemeService.setThemeToggle(checkedOrNot);
      // Fire & Forget. Service does the .dispatch()
    }

    onLabelShowHideChange(checkedOrNot: boolean) {

        // Call Service!
        this.myDebugDevelService.onLabelShowHideChangeInService(checkedOrNot);
        /* Q. fire & forget pretty much ?
           A.1. I don't think so...
           A.2. Well, maybe it is! t.b.d. << YEAH
         */

    } // onLabelShowHideChange()  (Call Service!)

    onLabelShowHideChangeNGRXBEAUTIFULLY(checkedOrNot: boolean) { // << NO LONGER CALLED
    // onLabelShowHideChange() { // << tried with no param from template click; hmm. maybe? we may well ignore it even if we do take it in.
        /* STORE
        WUL
         */
        console.log('this.onLabelShowHideChange - checkedOrNot ', checkedOrNot);
        /* Yeah. true false checked or cleared checkbox. ok.

        Hmm, but do we ignore that boolean value, not explicitly pass it
        to our dispatched Action? I think that is what we do - ignore. hmm. ok. mebbe.

        As noted on the HTML:
          "Hmm, ought we send no value? As the Store etc. will control the boolean for this? Hmm."
         */

        this.myStore.dispatch(new fromUI.ToggleShowLabels()); // << Thus far, still no payload. We'll see.

        /* NON-D.R.Y.
        Also in SideNav o well. Service, anyone? Hmm. And, maybe some Store use, hey?
         */
        /* We'll try IGNORING the "checkedOrNot" from U/I checkbox click.
Instead we'll test on our Observable$ from the Store. Won't we? o la.
         */
        console.log('this.onLabelShowHideChange - this.myShowLabelsStore$ hmm ', this.myShowLabelsStore$);
        /* Nah
        Whole "Store" {} object. crazy.
        Q. We need to .pipe() to get some value out of it ??
        A.1. Not looking good with Monsieur Le Pipe. Sheesh.
        (all we see (see below) is same whole damned Store or
        Observable or whatever it is useless huge impenetrable object. La.
        */

        // PIPE BIZ - DOES NOTHING:
        let localShowLabel$ = this.myShowLabelsStore$.pipe( // localShowLabel$ is Observable<boolean>  interesting.
            tap(
                (whatWeGetPipeTap: boolean) => {
                    console.log('whatWeGetPipeTap ', whatWeGetPipeTap); // Not seen. << we haven't done .subscribe() anywhere!!!
                    // localShowLabel$ = whatWeGetPipeTap;
                    // return localShowLabel$;
                    return whatWeGetPipeTap; // This ain't workin'
                }
            )
        )
        console.log('this.onLabelShowHideChange - localShowLabel$ ', localShowLabel$);
        /* Nah
        Still ? Whole "Store" {} object. Still ? crazy.

         */

        /*
        A.2. Uurrgghh. Learning lessons over (& over (& over)) again.
        YOU HAVE TO .SUBSCRIBE(), SOMEWHERE, TO THESE RXJS OBSERVABLE THING-A-MA-BOBS,
        or they will simply not fire/emit/kick-out-info/do-their-jobs.
        No .subscribe(), no info coming.
        So, your little .pipe() biz WON'T DO ANYTHING unless and until you do .SUBSCRIBE(), SOMEWHERE.

        Further explication:
        Q. Why do I say "somewhere"?
        A. Because as we see on HTTP requests, in the Service where you
        actually call the URL, you can (part 1) directly return the result (Observable stream btw)
        back to the calling Component, and NOT do ".subscribe()" right here
        in the Service = Okay, but then (part 2), yeah the
        calling Component MUST, "over there," do the .subscribe().
        If neither the Service nor the Component do .subscribe(), no data flows.

        So that location notion of "over there", in the Component,
        as opposed to "here" in the Service,
        is what I mean by "somewhere".
        One place or the other, but somewhere, the .subscribe() must be run.

        And then, yeah, sure, once .subscribe() is triggered, THEN okay
        the use of ".pipe()" can be used.

        My problem (idiot): I keep/kept viewing the two as "kinda interchangeable."
        Well, they isn't.
         */

        let localShowLabel: boolean;

        this.myShowLabelsStore$.subscribe(
            (whatWeGetSubscribe) => {
                console.log('whatWeGetSubscribe ', whatWeGetSubscribe);  // false << whoa.
                localShowLabel = whatWeGetSubscribe;
            }
        )

        if (localShowLabel) { // WAS: checkedOrNot    checked. so DO SHOW Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'inline')
        } else if (!localShowLabel) { // not checked. We HIDE Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'none')
        }
    } // /onLabelShowHideChangeNGRXBEAUTIFULLY()

    onLabelShowHideChangeWORKSBEAUTFULLY(checkedOrNot: boolean) { // << NO LONGER CALLED
        /* NON-D.R.Y.
        Also in SideNav o well. Service, anyone? Hmm. And, maybe some Store use, hey?
         */
        if (checkedOrNot) { // checked. so DO SHOW Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'inline')
        } else if (!checkedOrNot) { // not checked. We HIDE Labels
            document.documentElement.style.setProperty('--wr__hide-show-css-var', 'none')
        }
    } // /onLabelShowHideChangeWORKSBEAUTFULLY()

    myToggleMatSidenavHeader() {
        this.myToggleMatSidenavEventEmitterHeader.emit(null); // ? null o well
    }

}
