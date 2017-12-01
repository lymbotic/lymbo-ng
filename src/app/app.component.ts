import {Component, OnInit} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MatSnackBar} from '@angular/material';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {Card} from './model/card.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {
  operatingSystem = '';

  constructor(platformService: PlatformService,
              private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              public snackBar: MatSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  ngOnInit(): void {
    this.snackbarService.messageSubject.subscribe(
      (snack) => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );

    this.pouchDBService.sync('http://localhost:5984/lymbo');
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
