import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { DebugDevelService } from '../../core/services/debug-devel.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import * as fromUI from '../../shared/store/ui.actions';
import {Observable} from "rxjs";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output('myToggleMatSidenavEventEmitterSidenavName')
  myToggleMatSidenavEventEmitterSidenav: EventEmitter<any> = new EventEmitter<any>();

  myShowLabelsStore$: Observable<boolean>;
  myDarkThemeStore$: Observable<boolean>;

  constructor(
      private myThemeService: ThemeService,
      private myStore: Store,
      private myDebugDevelService: DebugDevelService,
  ) { }

  ngOnInit(): void {
    /* Note: UN-like over in HeaderComponent ngOnInit(), here in SideNav we do *NOT* run
             any default "init" of our onLabelShowHideChange(). No.
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

    /* ngOnInit() in DebugDevelService ?
    NO. Not in a Service
https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
Give this a go: << Working!
"@Thom - you can add a regular public init() method on your service, import the service and call it from your AppComponent's ngOnInit() – Joe Hanink Oct 28 '19 "
*/

      this.myDebugDevelService.myOwnInitForService();
    /* Q. Hmm, should BOTH call this ?? Header. Sidenav. hmm.

    For the non, guess I'll leave the call (above) in. hmm.

       A.1. Well, looks like we CAN call it ... but...
       That is, not breaking things (from what I can tell).
       Unsure if it is doing a lot of unnecessary redundant
       calling of the reducer .select() etc. etc.
       o well.

       A.2. But do note that it appears we can
       get away with NOT calling it from Sidenav!

       Why is that? I dunno, may be because the Header
       Component is ALWAYS instantiated, and does its own
       call for this init() in Service biz,
       and by the time we see the (user-requested-via-click)
       Sidenav instantiated, the Service already
       has gotten this Observable hooked up to the Store,
       re: show or hide labels. Doesn't need to be called
       by the just-showed-up Sidenav to have the
       Service (re)-perform this init() biz.
       Don't you think?
     */

    this.myThemeService.myOwnInitForService();
    // Above has Service do Store.select to get ThemeDark listener too...
    // Just like we do here  in this Component.

  } // /ngOnInit()

  myCloseSidenav() {
    // Here in Sidenav, we only Close, not Toggle, really ...
    this.myToggleMatSidenavEventEmitterSidenav.emit(null); // null's all we need
  }

  onThemeChange(checkedOrNot: boolean) {
    this.myThemeService.setThemeToggle(checkedOrNot);
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
    /* NON-D.R.Y.
       Also in Header o well. Service, anyone? Hmm. And, maybe some Store use, hey?
    */

    let localShowLabels: boolean;

    this.myStore.dispatch(new fromUI.ToggleShowLabels());

    this.myShowLabelsStore$.subscribe(
        (whatWeGetSubscribing:boolean) => {
          localShowLabels = whatWeGetSubscribing;
        }
    )

    if (localShowLabels) { // checked. so DO SHOW Labels
      document.documentElement.style.setProperty('--wr__hide-show-css-var', 'inline')
    } else if (!localShowLabels) { // not checked. We HIDE Labels
      document.documentElement.style.setProperty('--wr__hide-show-css-var', 'none')
    }
  } // /onLabelShowHideChangeNGRXBEAUTIFULLY()

}
