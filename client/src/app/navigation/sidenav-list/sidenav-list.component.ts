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
  }

  myCloseSidenav() {
    // Here in Sidenav, we only Close, not Toggle, really ...
    this.myToggleMatSidenavEventEmitterSidenav.emit(null); // null's all we need
  }

  onThemeChange(checkedOrNot: boolean) {
    this.myThemeService.setThemeToggle(checkedOrNot);
  }

}
