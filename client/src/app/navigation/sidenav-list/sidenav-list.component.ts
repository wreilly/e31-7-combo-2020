import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
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

  constructor(
      private myThemeService: ThemeService,
      private myStore: Store,
  ) { }

  ngOnInit(): void {
    /* Note: UN-like over in HeaderComponent ngOnInit(), here in SideNav we do *NOT* run
             any default "init" of our onLabelShowHideChange(). No.
     */

    this.myShowLabelsStore$ = this.myStore.select(fromRoot.getShowLabels);

  }

  myCloseSidenav() {
    // Here in Sidenav, we only Close, not Toggle, really ...
    this.myToggleMatSidenavEventEmitterSidenav.emit(null); // null's all we need
  }

  onThemeChange(checkedOrNot: boolean) {
    this.myThemeService.setThemeToggle(checkedOrNot);
  }

  onLabelShowHideChange(checkedOrNot: boolean) {
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
  }

}
