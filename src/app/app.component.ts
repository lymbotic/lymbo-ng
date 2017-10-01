import {Component} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent {
  title = 'Lymbo';
  operatingSystem = '';

  constructor(platformService: PlatformService, public snackBar: MdSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'settings': {
        this.openSnackBar('Clicked on menu item Settings', '');
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message
   * @param action
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
