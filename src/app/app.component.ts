import {Component, OnInit} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MdSnackBar} from '@angular/material';
import {DropResult, SUCCESS} from './components/file-drop/file-drop.component';
import {Subject} from 'rxjs/Subject';
import {StacksService} from './services/stacks.service';
import {Stack} from './model/stack.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  title = 'Lymbo';
  operatingSystem = '';

  dropContent: Subject<Stack> = new Subject();

  constructor(platformService: PlatformService, private stacksService: StacksService, public snackBar: MdSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  ngOnInit(): void {
    this.dropContent.asObservable().subscribe((result) => {
      this.stacksService.addStack(result);
    });
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

  public uploadedFiles(result: DropResult) {
    if (result.result == SUCCESS) {
      this.dropContent.next(result.payload);
    } else {
      this.openSnackBar('ERROR: Failed to parse dropped file.', '');
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
