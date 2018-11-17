import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-cards-toolbar',
  templateUrl: './cards-toolbar.component.html',
  styles: [require('./cards-toolbar.component.scss')]
})
export class CardsToolbarComponent {

  @Input() title = '';
  @Output() searchItemChangedEmitter = new EventEmitter<string>();
  @Output() menuItemClickedEmitter = new EventEmitter<string>();

  public state = 'active';

  constructor() {
  }

  public changeState(active: boolean, screenWidth: number) {
    this.state = active ? 'active' : (screenWidth > 1200) ? 'inactive' : 'inactive-small';
  }

  onMenuItemClicked(menuItem: string): void {
    this.menuItemClickedEmitter.emit(menuItem);
  }
}
