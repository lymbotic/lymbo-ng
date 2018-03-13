import {Component, OnInit} from '@angular/core';
import {PlatformService} from './services/platform.service';
import {OperatingSystem} from './model/operating-system';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SnackbarService} from './services/snackbar.service';
import {PouchDBService} from './services/pouchdb.service';
import {environment} from '../environments/environment.prod';
import {GitTag} from './model/git-tag.model';
import {NewFeaturesDialogComponent} from './view/dialogs/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {SettingsService} from './services/settings.service';
import {Setting} from './model/settings/setting.model';

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
              private pouchDBSettingsService: PouchDBSettingsService,
              private settingsService: SettingsService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
    this.operatingSystem = `${OperatingSystem[platformService.operatingSystem]}`;
  }

  ngOnInit(): void {
    this.settingsService.fetch();

    const dialogRef = this.dialog.open(NewFeaturesDialogComponent, {
      disableClose: false,
      data: {
        dialogTitle: 'New features',
        gitTags: environment.TAGS as GitTag[]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.settingsService.updateSetting(new Setting('version', result));
      }
    });

    this.snackbarService.messageSubject.subscribe(
      (snack) => {
        this.openSnackBar(snack[0], snack[1]);
      }
    );

    this.pouchDBService.sync('http://localhost:5984/lymbo');
    this.pouchDBSettingsService.sync('http://localhost:5984/lymbo-settings');
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
