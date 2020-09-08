import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output('myToggleMatSidenavEventEmitterSidenavName')
  myToggleMatSidenavEventEmitterSidenav: EventEmitter<any> = new EventEmitter<any>();

  constructor(
      private myThemeService: ThemeService,
  ) { }

  ngOnInit(): void {
    /* Note: UN-like over in HeaderComponent ngOnInit(), here in SideNav we do *NOT* run
             any default "init" of our onLabelShowHideChange(). No.
     */
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
    if (checkedOrNot) { // checked. so DO SHOW Labels
      document.documentElement.style.setProperty('--wr__hide-show-css-var', 'inline')
    } else if (!checkedOrNot) { // not checked. We HIDE Labels
      document.documentElement.style.setProperty('--wr__hide-show-css-var', 'none')
    }
  }

}
