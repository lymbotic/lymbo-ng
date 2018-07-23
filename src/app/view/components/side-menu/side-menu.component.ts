import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  menuItems = [];

  constructor() {
  }

  ngOnInit() {
    this.menuItems.push('Hello');
    this.menuItems.push('World');
  }

  onMenuItemClicked(menuItem: string): void {
    this.menuItemClickedEmitter.emit(menuItem);
  }

}
