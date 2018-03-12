import {Component, OnInit} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {environment} from '../environments/environment.prod';
import {GitTag} from './model/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/new-features-dialog/new-features-dialog.component';

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
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  ngOnInit(): void {
    (environment.TAGS as GitTag[]).forEach(t => {
      console.log(`annotation: ${t.annotation}, message: ${t.message}`);
    });

    const dialogRef = this.dialog.open(NewFeaturesDialogComponent, {
      disableClose: false,
      data: {
        dialogTitle: 'New features',
        gitTags: environment.TAGS as GitTag[]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // TODO Remember that those infos have been seen already
      }
    });

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
