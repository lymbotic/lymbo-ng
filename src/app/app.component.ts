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
    this.settingsService.settingsSubject.subscribe(settings => {
      if (settings.get('version') != null) {
        console.log(`latest version ${settings.get('version').value}`);
        this.showNewFeatures(settings.get('version').value);
      }

      this.snackbarService.messageSubject.subscribe(
        (snack) => {
          this.openSnackBar(snack[0], snack[1]);
        }
      );
    });

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

  private showNewFeatures(currentVersion: string) {
    // Current version
    const currentMajor = Number.parseInt(environment.VERSION.split('.')[0]);
    const currentMinor = Number.parseInt(environment.VERSION.split('.')[1]);
    const currentPatch = Number.parseInt(environment.VERSION.split('.')[2]);

    // Latest version
    const latestMajor = Number.parseInt(currentVersion.split('.')[0]);
    const latestMinor = Number.parseInt(currentVersion.split('.')[1]);
    const latestPatch = Number.parseInt(currentVersion.split('.')[2]);

    if ((currentMajor > latestMajor)
      || (currentMajor === latestMajor && currentMinor > latestMinor)
      || (currentMajor === latestMajor && currentMinor === latestMinor && currentPatch > latestPatch)
    ) {

      const dialogRef = this.dialog.open(NewFeaturesDialogComponent, {
        disableClose: false,
        data: {
          dialogTitle: 'New features',
          gitTags: (environment.TAGS as GitTag[]).filter(gt => {
            gt.annotation = gt.annotation.replace(/.*v/g, '');

            // Tag version
            const tagMajor = Number.parseInt(gt.annotation.split('.')[0]);
            const tagMinor = Number.parseInt(gt.annotation.split('.')[1]);
            const tagPatch = Number.parseInt(gt.annotation.split('.')[2]);

            const relevant = ((tagMajor > latestMajor)
              || (tagMajor === latestMajor && tagMinor > latestMinor)
              || (tagMajor === latestMajor && tagMinor === latestMinor && tagPatch > latestPatch)
            );

            console.log(`tag version ${gt.annotation}, relevant: ${relevant}`);

            return relevant;
          })
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // Save latest version
        this.settingsService.updateSetting(new Setting('version', environment.VERSION));
      });
    }
  }
}
