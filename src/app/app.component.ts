import {Component, OnInit} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MdSnackBar} from '@angular/material';
import {StacksService} from './services/stacks.service';
import {SnackbarService} from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  operatingSystem = '';

  constructor(platformService: PlatformService,
              private snackbarService: SnackbarService,
              public snackBar: MdSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  ngOnInit(): void {
    this.snackbarService.messageSubject.subscribe(
      (snack) => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );
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
