import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {environment} from '../environments/environment.prod';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {SettingsService} from './core/settings/services/settings.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ThemeService} from './core/ui/services/theme.service';
import {StacksService} from './core/entity/services/stack/stacks.service';
import {CardsService} from './core/entity/services/card/cards.service';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';

/**
 * Displays root element
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  /** Default app theme */
  themeClass = 'light-theme';

  /**
   * Constructor
   * @param stackService
   * @param cardService
   * @param {SnackbarService} snackbarService
   * @param {PouchDBService} pouchDBService
   * @param {PouchDBSettingsService} pouchDBSettingsService
   * @param {SettingsService} settingsService
   * @param {ThemeService} themeService
   * @param {OverlayContainer} overlayContainer
   * @param {MatSnackBar} snackBar snack bar
   */
  constructor(private stackService: StacksService,
              private cardService: CardsService,
              private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService,
              private pouchDBSettingsService: PouchDBSettingsService,
              private settingsService: SettingsService,
              private themeService: ThemeService,
              private overlayContainer: OverlayContainer,
              public snackBar: MatSnackBar) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeSnackbar();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeDatabaseSync();
  }

  //
  // Initialization
  //

  /**
   * Initializes snack bar
   */
  private initializeSnackbar() {
    this.snackbarService.messageSubject.subscribe(snack => {
        this.openSnackBar(snack[0], snack[1], snack[2]);
      }
    );
  }

  /**
   * Initializes database sync
   */
  private initializeDatabaseSync() {
    this.pouchDBService.sync(`http://localhost:5984/${environment.DATABASE_ENTITIES}`);
    this.pouchDBSettingsService.sync(`http://localhost:5984/${environment.DATABASE_SETTINGS}`);
  }

  //
  // Actions
  //

  /**
   * Handles messages that shall be displayed in a snack bar
   * @param message message to be displayed
   * @param actionName action name to be displayed
   * @param action action to be triggered if action name is clicked
   */
  private openSnackBar(message: string, actionName: string, action: any) {
    const snackbarRef = this.snackBar.open(message, actionName, <MatSnackBarConfig>{
      duration: 5000,
    });

    if (action != null) {
      snackbarRef.onAction().subscribe(action);
    }
  }
}
