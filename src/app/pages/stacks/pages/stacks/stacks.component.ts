import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {environment} from '../../../../../environments/environment';
import {AfterViewInit, Component, EventEmitter, Inject, NgZone, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {Media} from '../../../../core/ui/model/media.enum';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {Animations, ScrollDirection, ScrollState} from './stacks.animation';
import {map, takeUntil} from 'rxjs/operators';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Router} from '@angular/router';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {Action} from '../../../../core/entity/model/action.enum';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {StackDialogComponent} from '../../components/dialogs/stack-dialog/stack-dialog.component';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {Setting} from '../../../../core/settings/model/setting.model';
import {MatchService} from '../../../../core/entity/services/match.service';
import {TagDialogComponent} from '../../components/dialogs/tag-dialog/tag-dialog.component';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Card} from '../../../../core/entity/model/card/card.model';
import {SearchResult} from '../../../../core/image/model/search-result';
import {PexelsService} from '../../../../core/image/services/pexels.service';
import {MicrosoftTranslateService} from '../../../../core/translate/services/microsoft-translate.service';
import {Language} from '../../../../core/entity/model/card/language.enum';
import {Photo} from '../../../../core/image/model/photo.model';
import {VibrantPalette} from '../../../../core/entity/model/vibrant-palette';
import {UploadDialogComponent} from '../../components/dialogs/upload-dialog/upload-dialog.component';
import {FirebaseAuthenticationService} from '../../../../core/firebase/services/firebase-authentication.service';
import {User} from 'firebase';
import {FirebaseCloudFirestoreService} from '../../../../core/firebase/services/firebase-cloud-firestore.service';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {Tag} from '../../../../core/entity/model/tag/tag.model';
import {TagsService} from '../../../../core/entity/services/tag/tags.service';
import {UUID} from '../../../../core/entity/model/uuid';
import {LogService} from '../../../../core/log/services/log.service';
import {ConnectionService} from '../../../../core/common/services/connection.service';
// @ts-ignore
import Vibrant = require('node-vibrant');

/**
 * Displays stacks page
 */
@Component({
  selector: 'app-stacks',
  templateUrl: './stacks.component.html',
  styleUrls: ['./stacks.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class StacksComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** Array of cards */
  public stacks: Stack[] = [];
  /** Array of tags */
  public tags: Tag[] = [];

  /** Array of tags that are currently filtered */
  public tagsFiltered: Tag[] = [];
  /** Indicates whether a filter is active */
  public filterActive = false;

  /** Search items options for auto-complete */
  public searchOptions = [];

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Current user */
  public user: User;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Sidenav state */
  public sidenavOpened = false;

  /** Side navigation at start */
  @ViewChild('sidenavStart', {static: false}) sidenavStart: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable, {static: false}) scrollable: CdkScrollable;

  /**
   * Converts palette into a vibrant palette object
   * @param palette palette
   */
  static convertToVibrantPalette(palette: any): VibrantPalette {
    const vibrantPalette = new VibrantPalette();
    vibrantPalette.vibrant.rgb = palette['Vibrant']['rgb'];
    vibrantPalette.darkVibrant.rgb = palette['DarkVibrant']['rgb'];
    vibrantPalette.lightVibrant.rgb = palette['LightVibrant']['rgb'];
    vibrantPalette.muted.rgb = palette['Muted']['rgb'];
    vibrantPalette.darkMuted.rgb = palette['DarkMuted']['rgb'];
    vibrantPalette.lightMuted.rgb = palette['LightMuted']['rgb'];

    return vibrantPalette;
  }

  /**
   * Constructor
   * @param cardsService cards service
   * @param filterService filter service
   * @param firebaseAuthenticationService Firebase authentication service
   * @param firebaseCloudFirestoreService Firebase Cloud Firestore service
   * @param iconRegistry icon registry
   * @param matchService match service
   * @param materialColorService material color service
   * @param materialIconService material icon service
   * @param pexelsService pexels service
   * @param mediaService media service
   * @param microsoftTranslateService Microsoft translate service
   * @param router router
   * @param sanitizer sanitizer
   * @param scroll scroll
   * @param settingsService settings service
   * @param stacksService stacks service
   * @param stacksPersistenceService stacks persistence service
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param tagsService tags service
   * @param dialog dialog
   * @param zone zone
   */
  constructor(private cardsService: CardsService,
              private filterService: FilterService,
              private firebaseAuthenticationService: FirebaseAuthenticationService,
              private firebaseCloudFirestoreService: FirebaseCloudFirestoreService,
              private iconRegistry: MatIconRegistry,
              private matchService: MatchService,
              private materialColorService: MaterialColorService,
              private materialIconService: MaterialIconService,
              private mediaService: MediaService,
              private microsoftTranslateService: MicrosoftTranslateService,
              private pexelsService: PexelsService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private scroll: ScrollDispatcher,
              private settingsService: SettingsService,
              private stacksService: StacksService,
              @Inject(environment.PERSISTENCE_INJECTION_TOKEN) private stacksPersistenceService: StacksPersistenceService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              private tagsService: TagsService,
              public dialog: MatDialog,
              public zone: NgZone) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeStackSubscription();
    this.initializeFilterSubscription();
    this.initializeSuggestionSubscription();

    this.initializeFirebase();

    this.initializeMaterial();
    this.initializeMediaSubscription();

    this.initializeSettings();

    this.clearFilters();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges() {
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeScrollDetection();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  //
  // Initialization
  //

  // Stacks

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    // Clear stacks
    this.stacksPersistenceService.clearStacks();

    this.stacksPersistenceService.stacksSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const stacks = value as Stack[];
        this.assembleTags(stacks);

        this.initializeStacks(stacks);
        this.initializeTags(Array.from(this.tagsService.tags.values()));

        this.suggestionService.updateByStacks(this.stacks);
        this.suggestionService.updateByTags(this.tags);
      }
    });
  }

  /**
   * Initializes cards by filtering them
   * @param stacks cards
   */
  private initializeStacks(stacks: Stack[]) {
    this.stacks = stacks.filter(stack => {
      return this.filterStack(stack);
    });
  }

  /**
   * Checks if a stack matches current filter criteria
   * @param stack stack
   */
  private filterStack(stack: Stack) {
    const matchesSearchItem = this.matchService.stackMatchesEveryItem(stack, this.filterService.searchItem);
    const matchesTags = this.matchService.stackMatchesTags(stack, Array.from(this.filterService.tags.values()));

    return matchesSearchItem && matchesTags;
  }

  // Tags

  /**
   * Aggregates all tags a list of given stacks contain
   * @param stacks stacks
   */
  private assembleTags(stacks: Stack[]) {
    this.tagsService.tags.clear();
    stacks.forEach(stack => {
      if (stack.tags != null) {
        stack.tags.filter(tag => {
          return stack.tagIds.some(id => {
            return id === tag.id;
          });
        }).forEach(tag => {
          this.tagsService.tags.set(tag.id, tag);
        });
      }
    });
  }

  /**
   * Initializes tags by filtering them
   * @param tags tags
   */
  private initializeTags(tags: Tag[]) {
    this.tags = tags.filter(tag => {
      return this.tagIsContainedInStacks(tag, this.stacks);
    }).filter(tag => {
      return this.filterTag(tag);
    });
  }

  /**
   * Determines whether a tag is contained in a list of stacks
   * @param tag tag
   * @param stacks stacks
   */
  private tagIsContainedInStacks(tag: Tag, stacks: Stack[]) {
    return this.getTagIdsByStacks(stacks).some(id => {
      return id === tag.id;
    });
  }

  /**
   * Aggregates all tag IDs of a list of given stacks
   * @param stacks stacks
   */
  private getTagIdsByStacks(stacks: Stack[]): string[] {
    const tagIds = new Map<string, string>();

    stacks.forEach(stack => {
      stack.tagIds.forEach(tagId => {
        tagIds.set(tagId, tagId);
      });
    });

    return Array.from(tagIds.values());
  }

  /**
   * Checks if a tag matches current filter criteria
   * @param tag tag
   */
  private filterTag(tag: Tag): boolean {
    return this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
  }

  // Other

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.tagsFiltered = Array.from(this.filterService.tags.values());
      this.filterActive = this.filterService.searchItem.length > 0
        || this.tagsFiltered.length > 0;

      // Filter stacks
      this.stacks = Array.from(this.stacksPersistenceService.stacks.values()).filter((stack: Stack) => {
        return this.filterStack(stack);
      }).sort(StacksService.sortStacks);
    });
  }

  /**
   * Initializes existing user after navigation
   */
  private initializeFirebaseUser() {
    LogService.trace('initializeFirebaseUser');
    const user = this.firebaseAuthenticationService.user;

    if (user != null) {
      this.handleUser(user);
    }
  }

  /**
   * Initializes suggestion subscription
   */
  private initializeSuggestionSubscription() {
    LogService.trace('initializeSuggestionSubscription');
    this.searchOptions = Array.from(this.suggestionService.searchOptions.values()).reverse();
    this.suggestionService.searchOptionsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.searchOptions = (value as string[]).reverse();
      }
    });
  }

  /**
   * Initializes firebase
   */
  private initializeFirebase() {
    if (ConnectionService.isOnline()) {
      this.initializeFirebaseUser();
      this.initializeFirebaseUserSubscription();
    } else {
      this.snackbarService.showSnackbar('You are offline. Changes will not be saved');
    }
  }

  /**
   * Initialize firebase user subscription
   */
  private initializeFirebaseUserSubscription() {
    this.firebaseAuthenticationService.userSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(user => {
      this.handleUser(user);
    });
  }

  /**
   * Handles user by after he/she has been recognized
   * @param user user
   */
  private handleUser(user: User) {
    if (user != null) {
      // Save previous stacks
      const previousStacks = CloneService.cloneStacks(this.stacks);

      // Clear stacks
      this.stacksPersistenceService.clearStacks();

      if (!user.isAnonymous) {
        // Show welcome message
        this.snackbarService.showSnackbar(`Welcome back ${user.displayName}!`);

        // Take stacks from anonymous user
        if (previousStacks.length > 0) {
          this.stacksPersistenceService.createStacks(previousStacks.filter(stack => {
            return !this.stacks.some(s => {
              return s.id === stack.id;
            });
          }).map(stack => {
            stack.id = new UUID().toString();
            stack.owner = user.uid;
            return stack;
          })).then(() => {
          });
        }
      }

      // Find stacks
      this.stacksPersistenceService.findStacks(user);
    } else {
      // Show goodbye message
      this.snackbarService.showSnackbar(`Goodbye.`);

      this.firebaseAuthenticationService.loginAnonymously();
    }

    this.user = user;
  }

  /**
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialIconService.initializeIcons(this.iconRegistry, this.sanitizer);
  }

  /**
   * Initializes media subscription
   */
  private initializeMediaSubscription() {
    this.media = this.mediaService.media;
    this.mediaService.mediaSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      this.media = value as Media;
    });
  }

  /**
   * Initializes scroll detection
   */
  private initializeScrollDetection() {
    let scrollTimeout = null;

    this.scroll.scrolled(0)
      .pipe(map(() => {
        // Update scroll state
        this.scrollState = ScrollState.SCROLLING;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.scrollState = ScrollState.NON_SCROLLING;
        }, 500);

        // Update scroll direction
        if (this.scrollable != null) {
          const scrollPos = this.scrollable.getElementRef().nativeElement.scrollTop;
          if (this.scrollDirection === ScrollDirection.UP && scrollPos > this.scrollPosLast) {
            this.scrollDirection = ScrollDirection.DOWN;
            // Since scroll is run outside Angular zone change detection must be triggered manually
            this.zone.run(() => {
            });
          } else if (this.scrollDirection === ScrollDirection.DOWN && scrollPos < this.scrollPosLast) {
            this.scrollDirection = ScrollDirection.UP;
            // Since scroll is run outside Angular zone change detection must be triggered manually
            this.zone.run(() => {
            });
          }

          // Save current scroll position
          this.scrollPosLast = scrollPos;
        }
      })).subscribe();
  }

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
    this.settingsService.settingsSubject.subscribe(value => {
      if (value != null) {
        this.sidenavOpened = this.settingsService.isSettingActive(SettingType.STACKS_SIDENAV_OPENED);
      }
    });
  }

  /**
   * Clears all filters
   */
  private clearFilters() {
    this.filterService.clearAllFilters().then(() => {
    });
  }

  //
  // Actions
  //

  /**
   * Handles click on add stack button
   */
  onAddStackClicked() {
    this.onStackEvent({action: Action.OPEN_DIALOG_ADD, stack: null});
  }

  /**
   * Handles events targeting a stack
   * @param event event parameters
   */
  onStackEvent(event: { action: Action, stack: Stack, tags?: Tag[] }) {
    const stack = CloneService.cloneStack(event.stack as Stack);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        // Set owner
        stack.owner = this.firebaseAuthenticationService.user.uid;

        // Create new entities if necessary
        this.evaluateStackTags(stack, tags);

        // Fetch photo
        this.fetchPhoto(stack, tags.map(t => {
          return t.name;
        })).then((result) => {
          stack.imageUrl = result;

          // Fetch palette
          this.getPalette(result).then(resolve => {
            stack.imagePalette = resolve;

            // Add stack
            this.addStack(stack);
          }, () => {

            // Add stack
            this.addStack(stack);
          });

        }, () => {
          // Add stack
          this.addStack(stack);
        }).catch(err => {
          LogService.fatal(err);
        });

        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateStackTags(stack, tags);

        // Fetch photo
        this.fetchPhoto(stack, tags.map(t => {
          return t.name;
        })).then((result) => {
          stack.imageUrl = result;

          // Fetch palette
          this.getPalette(result).then(resolve => {
            stack.imagePalette = resolve;

            // Update stack
            this.updateStack(stack);
          }, () => {

            // Update stack
            this.updateStack(stack);
          });

        }, () => {

          // Update stack
          this.updateStack(stack);
        });
        break;
      }
      case Action.DELETE: {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          data: {
            title: 'Delete stack',
            text: 'Do you want to delete this stack?',
            action: 'Delete',
            value: stack
          }
        });
        confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
          if (confirmationResult != null) {
            this.stacksPersistenceService.clearStacks();
            this.stacksPersistenceService.deleteStack(confirmationResult as Stack).then(() => {
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add stack',
          stack: new Stack(),
          stacks: this.stacks,
          tags: []
        };

        // Open dialog
        const dialogRef = this.dialog.open(StackDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingStack = result.stack as Stack;
            const resultingTags = result.tags as Tag[];

            this.onStackEvent({
              action: resultingAction,
              stack: resultingStack,
              tags: resultingTags
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update stack',
          stack,
          stacks: this.stacks,
          tags: stack.tagIds.map(id => {
            return this.tagsService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          })
        };

        // Open dialog
        const dialogRef = this.dialog.open(StackDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingStack = result.stack as Stack;
            const resultingTags = result.tags as Tag[];

            this.onStackEvent({
              action: resultingAction,
              stack: resultingStack,
              tags: resultingTags
            });
          }
        });
        break;
      }
      case Action.GO_INTO: {
        this.router.navigate([`/cards/${stack.id}`]).then(() => {
        });
        break;
      }
    }
  }

  /**
   * Handles events targeting a tag
   * @param event event parameters
   */
  onTagEvent(event: { action: Action, stack?: Stack, tag?: Tag, tags?: Tag[] }) {
    const stack = CloneService.cloneStack(event.stack as Stack);
    const tag = CloneService.cloneTag(event.tag as Tag);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateTagsListIfNotEmpty([tag]);
        this.addTag(stack, tag).then(() => {
          this.snackbarService.showSnackbar('Added tag');
        }, () => {
          this.snackbarService.showSnackbar('Failed to add tag');
        });
        break;
      }
      case Action.UPDATE: {
        this.updateTag(stack, tag).then(() => {
          this.snackbarService.showSnackbar('Updated tag');
        }, () => {
          this.snackbarService.showSnackbar('Failed to update tag');
        });
        break;
      }
      case Action.DELETE: {
        const referencesStacks = Array.from(this.stacksPersistenceService.stacks.values()).some((s: Stack) => {
          return s.tagIds != null && s.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });
        const referencesCards = Array.from(this.cardsService.cards.values()).some((card: Card) => {
          return card.tagIds != null && card.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });

        if (referencesStacks || referencesCards) {
          this.dialog.open(InformationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Cannot delete tag',
              text: `There are still tasks associated with this tag.`,
              action: 'Okay',
              value: tag
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            data: {
              title: 'Delete tag',
              text: 'Do you want to delete this tag?',
              action: 'Delete',
              value: tag
            }
          });
          confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult != null) {
              this.tagsService.deleteTag(stack, confirmationResult as Tag).then(() => {
              });
              this.filterService.tags.delete((confirmationResult as Tag).id);
            }
          });
        }
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add tag',
          stack,
          tag: new Tag('')
        };

        // Open dialog
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingStack = result.stack as Stack;
            const resultingTag = result.tag as Tag;

            this.onTagEvent({
              action: resultingAction,
              stack: resultingStack,
              tag: resultingTag,
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_UPDATE: {
        // Not supported since you cannot know to which stack the tag belongs

        /*
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update tag',
          stack: stack,
          tag: tag
        };

        // Open dialog
        const dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: false,
          data: data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingTag = result.tag as Tag;

            this.onTagEvent({
              action: resultingAction,
              stack: stack,
              tag: resultingTag
            });
          }
        });
        */
        break;
      }
      case Action.FILTER_SINGLE: {
        this.filterService.clearTags();
        this.filterService.updateTagsList(tags);
        break;
      }
      case Action.FILTER_LIST: {
        this.filterService.updateTagsList(tags);
        break;
      }
    }
  }

  /**
   * Handles click on menu items
   * @param menuItem menu item that has been clicked
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'menu': {
        if (this.media < Media.LARGE) {
          this.sidenavStart.toggle();
        }
        break;
      }
      case 'login': {
        this.firebaseAuthenticationService.loginWithGoogle();
        break;
      }
      case 'logout': {
        this.firebaseAuthenticationService.logout();
        break;
      }
      case 'clear-filters': {
        this.filterService.clearAllFilters().then(() => {
        });
        this.snackbarService.showSnackbar('Filters cleared');
        break;
      }
      case 'upload': {
        this.dialog.open(UploadDialogComponent, {
          disableClose: false,
          data: {
            title: 'Upload',
            user: this.user
          }
        });
        break;
      }
      case 'settings': {
        this.router.navigate(['/settings']).then(() => {
        });
        break;
      }
      case 'android-release': {
        const filename = 'basalt-release.apk';
        const element = document.createElement('a');
        element.setAttribute('href', 'assets/basalt.apk');
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        break;
      }
      case 'about': {
        this.dialog.open(AboutDialogComponent, {
          disableClose: false,
          data: {
            title: 'About',
            name: environment.NAME,
            version: environment.VERSION,
            license: environment.LICENSE,
            homepage: environment.HOMEPAGE,
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Handles search item typed into the search field
   * @param searchItem new search item
   */
  onSearchItemChanged(searchItem: string) {
    this.filterService.updateSearchItem(searchItem);
  }

  /**
   * Handles sidenav opening event
   */
  onSidenavOpened() {
    LogService.trace(`onSidenavOpened`);
    this.settingsService.updateSetting(new Setting(SettingType.STACKS_SIDENAV_OPENED, true));
  }

  /**
   * Handles sidenav closing event
   */
  onSidenavClosed() {
    LogService.trace(`onSidenavClosed`);
    this.settingsService.updateSetting(new Setting(SettingType.STACKS_SIDENAV_OPENED, false));
  }

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.onStackEvent({action: Action.OPEN_DIALOG_ADD, stack: null});
    }
  }

  //
  // Helpers
  //

  /**
   * Adds a stack
   * @param stack stack
   */
  private addStack(stack: Stack) {
    this.stacksPersistenceService.clearStacks();
    this.stacksPersistenceService.createStack(stack).then(() => {
      this.snackbarService.showSnackbar('Added stack');
    }).catch(err => {
      LogService.fatal(err);
    });
  }

  /**
   * Updates a stack
   * @param stack stack
   */
  private updateStack(stack: Stack) {
    this.stacksPersistenceService.clearStacks();
    this.stacksPersistenceService.updateStack(stack).then(() => {
      this.snackbarService.showSnackbar('Updated stack');
    }).catch(err => {
      LogService.fatal(err);
    });
  }

  /**
   * Adds a tag
   * @param stack stack
   * @param tag tag
   */
  private addTag(stack: Stack, tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tagsService.createTag(stack, tag).then(() => {
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          LogService.fatal(err);
          reject();
        });
      }).catch(err => {
        LogService.fatal(err);
        reject();
      });
    });
  }

  /**
   * Updates a tag
   * @param stack stack
   * @param tag tag
   */
  private updateTag(stack: Stack, tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tagsService.updateTag(stack, tag).then(() => {
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          LogService.fatal(err);
          reject();
        });
      }).catch(err => {
        LogService.fatal(err);
        reject();
      });
    });
  }

  /**
   * Determines whether the tags assigned to a given stack already exist, otherwise creates new ones
   * @param stack task assign tags to
   * @param tags array of tags to be checked
   */
  private evaluateStackTags(stack: Stack, tags: Tag[]) {
    if (tags != null) {
      const aggregatedTagIds = new Map<string, string>();

      // New tag
      tags.forEach(t => {
        let tag = this.tagsService.getTagByName(t.name);

        if (tag == null) {
          tag = new Tag(t.name, true);
          this.tagsService.createTag(stack, tag).then(() => {
          });
        }

        this.filterService.updateTagsListIfNotEmpty([tag]);
        aggregatedTagIds.set(tag.id, tag.id);
      });

      stack.tagIds = Array.from(aggregatedTagIds.values());
    } else {
      // Unassign tags
      stack.tagIds = [];
    }
  }

  // Image

  /**
   * Fetches photos and uses it as stack image
   * @param stack stack
   * @param searchItems search items
   */
  private fetchPhoto(stack: Stack, searchItems: string[]): Promise<any> {
    return new Promise((resolve, reject) => {

      if (ConnectionService.isOnline()) {
        const apiKeyPexels = this.settingsService.settings.get(SettingType.API_KEY_PEXELS_IMAGE);
        const apiKeyMicrosoftTextTranslate = this.settingsService.settings.get(SettingType.API_KEY_MICROSOFT_TEXT_TRANSLATE);

        // Reject if no API key is specified
        if (apiKeyPexels === null) {
          reject();
        }

        const resultEmitter: EventEmitter<SearchResult> = new EventEmitter<SearchResult>();
        resultEmitter.subscribe(result => {
          if (result != null && result.photos != null && result.photos.length > 0) {
            resolve((result.photos[0] as Photo).src.landscape);
          } else {
            reject();
          }
        });

        if (apiKeyMicrosoftTextTranslate !== null) {
          // Try to translate into English, then call Pexels service
          const translationEmitter: EventEmitter<string> = new EventEmitter<string>();
          translationEmitter.subscribe(result => {
            if (result != null) {
              // Search for images with translated tags
              this.pexelsService.search(result.split(', '), 1, 1, resultEmitter);
            } else {
              // Search for images with original tags
              this.pexelsService.search(searchItems, 1, 1, resultEmitter);
            }
          });
          this.microsoftTranslateService.translate(searchItems.join(', '), Language.ENGLISH, translationEmitter);
        } else {
          // Call Pexels service without translating
          this.pexelsService.search(searchItems, 1, 1, resultEmitter);
        }
      } else {
        reject();
      }
    });
  }

  // Palette

  /**
   * Determines palette by a given image URL
   * @param imageUrl image URL
   */
  private getPalette(imageUrl: string): Promise<VibrantPalette> {
    return new Promise((resolve, reject) => {
      if (imageUrl != null) {
        Vibrant.from(imageUrl).getPalette((err, result) => {
          resolve(StacksComponent.convertToVibrantPalette(result));
        }).then(() => {
        });
      } else {
        reject();
      }
    });
  }
}
