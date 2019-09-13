import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from '../../../../../environments/environment';
import {AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialog, MatIconRegistry, MatSidenav} from '@angular/material';
import {Media} from '../../../../core/ui/model/media.enum';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {Animations, ScrollDirection, ScrollState} from './cards.animation';
import {filter, map, takeUntil} from 'rxjs/operators';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../core/entity/model/stack/stack.model';
import {Tag} from '../../../../core/entity/model/tag/tag.model';
import {MatchService} from '../../../../core/entity/services/match.service';
import {Action} from '../../../../core/entity/model/action.enum';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {CardDialogComponent} from '../../components/dialogs/card-dialog/card-dialog.component';
import {TagDialogComponent} from '../../components/dialogs/tag-dialog/tag-dialog.component';
import {Card} from '../../../../core/entity/model/card/card.model';
import {FormControl} from '@angular/forms';
import {STACK_PERSISTENCE_FIRESTORE} from '../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {TagsService} from '../../../../core/entity/services/tag/tags.service';
import {FirebaseAuthenticationService} from '../../../../core/firebase/services/firebase-authentication.service';
import {FirebaseCloudFirestoreService} from '../../../../core/firebase/services/firebase-cloud-firestore.service';
import {User} from 'firebase';
import {Setting} from '../../../../core/settings/model/setting.model';
import {SettingType} from '../../../../core/settings/model/setting-type.enum';
import {Direction, StackConfig, SwingCardComponent, SwingStackComponent, ThrowEvent} from 'angular2-swing';
import {CardsDisplayMode} from '../../../../core/settings/model/cards-display-mode.enum';

/**
 * Displays cards page
 */
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  animations: [
    Animations.toolbarAnimation,
    Animations.fabAnimation,
    Animations.dateIndicatorAnimation,
  ]
})
export class CardsComponent implements OnInit, AfterViewInit, OnDestroy {

  /** App title */
  public title = environment.APP_NAME;

  /** ID passed as an argument */
  public id: string;
  /** Stack */
  public stack: Stack;
  /** Array of cards */
  public cards: Card[] = [];
  /** Indicates whether cards in multiple boxes */
  public cardsAreInMultipleBoxes = false;
  /** Number of boxes */
  public boxesCount = 0;
  /** Boxes */
  public boxes = [];

  /** Array of cards */
  public stacks: Stack[] = [];
  /** Array of tags */
  public tags: Tag[] = [];

  /** Map of settings */
  public settingsMap = new Map<string, Setting>();
  /** Sidenav state */
  public sidenavOpened = false;
  /** Cards display mode */
  public cardsDisplayMode = CardsDisplayMode.LIST;

  /** Whether all cards are flipped */
  public viceVersa = false;

  /** Array of tags that are currently filtered */
  public tagsFiltered: Tag[] = [];
  /** Indicates whether a filter for favorite cards is active */
  public filterFavorites = false;
  /** Indicates whether a filter is active */
  public filterActive = false;

  /** Search items options for auto-complete */
  public searchOptions = [];

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Enum of action types */
  public actionType = Action;

  /** Current user */
  public user: User;

  /** Title color */
  public titleColor = 'black';
  /** FAB color */
  public fabColor = 'black';

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Side navigation at start */
  @ViewChild('sidenavStart', {static: false}) sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd', {static: false}) sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable, {static: false}) scrollable: CdkScrollable;

  /** Selected tab */
  selectedTab = new FormControl(0);

  /** Enum of cards display mode */
  public cardsDisplayModeType = CardsDisplayMode;

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
   * @param mediaService media service
   * @param route route
   * @param router router
   * @param sanitizer sanitizer
   * @param scroll scroll
   * @param settingsService settings service
   * @param stacksPersistenceService stacks persistence service
   * @param snackbarService snackbar service
   * @param suggestionService suggestion service
   * @param tagsService tag service
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
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private scroll: ScrollDispatcher,
              private settingsService: SettingsService,
              @Inject(STACK_PERSISTENCE_FIRESTORE) private stacksPersistenceService: StacksPersistenceService,
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
    this.initializeCardSubscription();
    this.initializeFilterSubscription();
    this.initializeSettingsSubscription();
    this.initializeSuggestionSubscription();
    this.initializeDatabaseErrorSubscription();

    // TODO Check internet connection
    this.initializeFirebaseUser();
    this.initializeFirebaseUserSubscription();

    this.initializeParameters();
    // this.initializeResolvedData();

    this.initializeViceVersa();
    this.initializeFilters();

    this.initializeMaterial();
    this.initializeMediaSubscription();
  }

  /**
   * Handles after-view-init lifecycle phase
   */
  ngAfterViewInit() {
    this.initializeScrollDetection();

    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.findEntities(this.id, this.user);
    });

    this.findSettings();
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

  // Subscriptions

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    this.stacksPersistenceService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        const stack = value as Stack;
        this.assembleTags(stack);

        this.initializeStack(stack);
        this.initializeTags(Array.from(this.tagsService.tags.values()));

        this.suggestionService.updateByCards(this.cards);
        this.suggestionService.updateByTags(this.tags);
      }
    });
  }

  /**
   * Initializes card subscription
   */
  private initializeCardSubscription() {
    this.cardsService.cardsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeCards(value as Card[]);
        this.initializeCardsAreInMultipleBoxes();
      }
    });
  }

  /**
   * Initializes filter subscription
   */
  private initializeFilterSubscription() {
    this.filterService.filterSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(() => {
      this.tagsFiltered = Array.from(this.filterService.tags.values());
      this.filterFavorites = this.filterService.favorites;
      this.filterActive = this.filterService.searchItem.length > 0
        || this.tagsFiltered.length > 0;

      // Filter and sort cards
      this.cards = Array.from(this.cardsService.cards.values()).filter((card: Card) => {
        return this.filterCard(card);
      }).sort(CardsService.sortCards);
    });
  }

  /**
   * Initializes settings subscription
   */
  private initializeSettingsSubscription() {
    this.settingsService.settingsSubject.pipe(
      takeUntil(this.unsubscribeSubject),
      filter(value => value != null)
    ).subscribe(value => {
      if (value != null) {
        const settings = value as Map<string, Setting>;
        this.initializeSettings(settings);
      }
    });
  }

  /**
   * Initializes suggestion subscription
   */
  private initializeSuggestionSubscription() {
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
   * Initializes database error subscription
   */
  private initializeDatabaseErrorSubscription() {
    this.stacksPersistenceService.databaseErrorSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      // TODO Check error more specifically
      if (value != null) {
        this.snackbarService.showSnackbar('Speicherplatz knapp. Spiel wird nicht gespeichert.');
      }
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
      })).subscribe();
  }

  // Firebase

  /**
   * Initializes existing user after navigation
   */
  private initializeFirebaseUser() {
    const user = this.firebaseAuthenticationService.user;

    if (user != null) {
      this.handleUser(user);
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

  // Parameters

  /**
   * Initializes parameters
   */
  private initializeParameters() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * Initializes resolved data
   */
  private initializeResolvedData() {
    const resolved = this.route.snapshot.data['stack'];
    if (resolved != null) {
      const stack = resolved as Stack;
      this.assembleTags(stack);

      this.initializeStack(stack);
      this.initializeTags(Array.from(this.tagsService.tags.values()));

      this.suggestionService.updateByCards(this.cards);
      this.suggestionService.updateByTags(this.tags);
    }
  }

  // Others

  /**
   * Initializes vice versa
   */
  private initializeViceVersa() {
    this.viceVersa = this.cardsService.viceVersa;
  }

  /**
   * Clears all filters
   */
  private initializeFilters() {
    this.filterService.clearAllFilters().then();
  }

  // Media

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

  //
  //
  //

  // Stack

  /**
   * Initializes stack
   * @param stack stack
   */
  private initializeStack(stack: Stack) {
    this.stack = stack;

    if (stack != null) {
      this.initializeTitle(stack);
      this.initializeColors(stack);
      this.initializeBoxes(stack);
      this.cardsService.initializeCards(stack.cards);
    }
  }

  /**
   * Initializes title
   * @param stack stack
   */
  private initializeTitle(stack: Stack) {
    this.title = stack != null ? stack.title : this.title;
  }

  /**
   * Initializes colors
   * @param stack stack
   */
  private initializeColors(stack: Stack) {
    if (stack.imagePalette != null) {
      const muted = stack.imagePalette.muted;
      const vibrant = stack.imagePalette.vibrant;
      this.titleColor = `rgb(${muted.rgb[0]},${muted.rgb[1]},${muted.rgb[2]})`;
      this.fabColor = `rgb(${vibrant.rgb[0]},${vibrant.rgb[1]},${vibrant.rgb[2]})`;
    } else {
      const primary = this.materialColorService.primary;
      const accent = this.materialColorService.accent;
      this.titleColor = primary;
      this.fabColor = accent;
    }
  }

  /**
   * Initializes boxes
   */
  private initializeBoxes(stack: Stack) {
    this.boxes = [];
    this.boxesCount = this.cardsService.getBoxCount(stack.cards);

    for (let i = 0; i < this.boxesCount; i++) {
      this.boxes.push(i);

    }
  }

  // Cards

  /**
   * Initializes cards by filtering them
   * @param cards cards
   */
  private initializeCards(cards: Card[]) {

    // Filter and sort cards
    this.cards = cards.filter(card => {
      return this.filterCard(card);
    }).sort(CardsService.sortCards);
  }

  /**
   * Initializes whether cards are in multiple boxes
   */
  private initializeCardsAreInMultipleBoxes() {
    this.cardsAreInMultipleBoxes = this.cardsService.getBoxCount(this.cards) > 1;
  }

  /**
   * Checks if a card matches current filter criteria
   * @param card card
   */
  private filterCard(card: Card) {
    const matchesSearchItem = this.matchService.cardMatchesEveryItem(card, this.filterService.searchItem);
    const matchesTags = this.matchService.cardMatchesTags(card, Array.from(this.filterService.tags.values()));
    const matchesFavorites = MatchService.cardMatchesFavorites(card, this.filterService.favorites);

    return matchesSearchItem && matchesTags && matchesFavorites;
  }

  // Tags

  /**
   * Aggregates all tags a given stack contains
   * @param stack stack
   */
  private assembleTags(stack: Stack) {
    this.tagsService.tags.clear();
    if (stack.tags != null) {
      stack.tags.filter(tag => {
        return stack.cards.some(card => {
          return card.tagIds.some(id => {
            return id === tag.id;
          });
        });
      }).forEach(tag => {
        this.tagsService.tags.set(tag.id, tag);
      });
    }
  }

  /**
   * Initializes tags by filtering them
   * @param tags tags
   */
  private initializeTags(tags: Tag[]) {
    this.tags = tags.filter(tag => {
      return this.cardsService.tagIsContainedInCards(this.cards, tag);
    }).filter(tag => {
      return this.filterTag(tag);
    });
  }

  /**
   * Checks if a tag matches current filter criteria
   * @param tag tag
   */
  private filterTag(tag: Tag): boolean {
    return this.matchService.tagMatchesEveryItem(tag, this.filterService.searchItem);
  }

  // User

  /**
   * Handles user by after he/she has been recognized
   * @param user user
   */
  private handleUser(user: User) {
    if (user != null) {
      this.findEntities(this.id, user);
    } else {
      // Show goodbye message
      this.snackbarService.showSnackbar(`Goodbye.`);

      this.firebaseAuthenticationService.loginAnonymously();
    }

    this.user = user;
  }

  // Settings

  /**
   * Initializes settings
   * @param settingsMap settings map
   */
  private initializeSettings(settingsMap: Map<string, Setting>) {
    this.settingsMap = new Map(settingsMap);
    this.sidenavOpened = SettingsService.isSettingActive(SettingType.CARD_SIDENAV_OPENED, this.settingsMap);
    this.cardsDisplayMode = SettingsService.getCardsDisplayMode(this.settingsMap);

    if (this.sidenavOpened) {
      this.sidenavStart.open();
    } else {
      this.sidenavStart.close();
    }
  }

  //
  // Find
  //

  /**
   * Finds entities by a given ID and a given user
   * @param id ID
   * @param user user
   */
  private findEntities(id: string, user: User) {
    if (id != null && user != null) {
      this.stacksPersistenceService.findStackByID(this.id, user);
    }
  }

  /**
   * Finds settings
   */
  private findSettings() {
    this.settingsService.fetch();
  }

  //
  // Actions
  //

  /**
   * Handles click on add card button
   */
  onAddCardClicked() {
    this.onCardEvent({action: Action.OPEN_DIALOG_ADD, stack: this.stack, card: null});
  }

  /**
   * Handles events targeting a card
   * @param event event parameters
   */
  onCardEvent(event: { action: Action, stack: Stack, card: Card, tags?: Tag[] }) {
    const stack = CloneService.cloneStack(event.stack as Stack);
    const card = CloneService.cloneCard(event.card as Card);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        // Create new entities if necessary
        this.evaluateCardTags(stack, card, tags);

        // Add card
        this.addCard(stack, card).then();
        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateCardTags(stack, card, tags);

        // Update card
        this.updateCard(stack, card).then(() => {
          this.snackbarService.showSnackbar('Updated card');
        }, () => {
          this.snackbarService.showSnackbar('Failed to update card');
        });
        break;
      }
      case Action.PUT_TO_END: {
        this.cardsService.putCardToEnd(stack, card).then(() => {

          // Update card
          this.updateCard(stack, card).then(() => {
            this.snackbarService.showSnackbar('Put card to end');
          }, () => {
            this.snackbarService.showSnackbar('Failed to put card to end');
          });
        });
        break;
      }
      case Action.MOVE_TO_NEXT_BOX: {
        this.cardsService.moveCardToNextBox(stack, card).then(() => {
          this.initializeCardsAreInMultipleBoxes();

          // Update card
          this.updateCard(stack, card).then(() => {
            this.snackbarService.showSnackbar('Moved card to next box');
          }, () => {
            this.snackbarService.showSnackbar('Failed to move card to next box');
          });
        });
        break;
      }
      case Action.SET_FAVORITE: {
        this.cardsService.setFavorite(stack, card, true).then(() => {

          // Update card
          this.updateCard(stack, card).then(() => {
            this.snackbarService.showSnackbar('Added card to favorites');
          }, () => {
            this.snackbarService.showSnackbar('Failed to add card to favorites');
          });
        });
        break;
      }
      case Action.UNSET_FAVORITE: {
        this.cardsService.setFavorite(stack, card, false).then(() => {

          // Update card
          this.updateCard(stack, card).then(() => {
            this.snackbarService.showSnackbar('Removed card from favorites');
          }, () => {
            this.snackbarService.showSnackbar('Failed to remove card from favorites');
          });
        });
        break;
      }
      case Action.DELETE: {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          data: {
            title: 'Delete card',
            text: 'Do you want to delete this card?',
            action: 'Delete',
            value: card
          }
        });
        confirmationDialogRef.afterClosed().subscribe(confirmationResult => {
          if (confirmationResult != null) {
            this.deleteCard(stack, confirmationResult as Card).then(() => {
              this.snackbarService.showSnackbar('Deleted card');
            }, () => {
              this.snackbarService.showSnackbar('Failed to deleted card');
            });
          }
        });
        break;
      }
      case Action.OPEN_DIALOG_ADD: {
        // Assemble data to be passed
        const data = {
          mode: DialogMode.ADD,
          dialogTitle: 'Add card',
          card: new Card(),
          stack,
          tags: []
        };

        // Open dialog
        const dialogRef = this.dialog.open(CardDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingStack = result.stack as Stack;
            const resultingCard = result.card as Card;
            const resultingTags = result.tags as Tag[];

            this.onCardEvent({
              action: resultingAction,
              stack: resultingStack,
              card: resultingCard,
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
          dialogTitle: 'Update card',
          card,
          stack: this.stack,
          tags: card.tagIds.map(id => {
            return this.tagsService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          })
        };

        // Open dialog
        const dialogRef = this.dialog.open(CardDialogComponent, {
          disableClose: false,
          data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingStack = result.stack as Stack;
            const resultingCard = result.card as Card;
            const resultingTags = result.tags as Tag[];

            this.onCardEvent({
              action: resultingAction,
              stack: resultingStack,
              card: resultingCard,
              tags: resultingTags
            });
          }
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
        this.tagsService.createTag(stack, tag).then(() => {
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
          stack: this.stack,
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
        // Assemble data to be passed
        const data = {
          mode: DialogMode.UPDATE,
          dialogTitle: 'Update tag',
          stack: this.stack,
          tag
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
              tag: resultingTag
            });
          }
        });
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
        this.settingsService.updateSetting(new Setting(SettingType.STACKS_SIDENAV_OPENED, !this.sidenavOpened));
        break;
      }
      case 'back': {
        this.cardsService.clearCards();
        this.router.navigate([`/stacks`]).then();
        break;
      }
      case 'set-display-mode-list': {
        this.settingsService.updateSetting(new Setting(SettingType.CARDS_DISPLAY_MODE, CardsDisplayMode.LIST));
        break;
      }
      case 'set-display-mode-stack': {
        this.settingsService.updateSetting(new Setting(SettingType.CARDS_DISPLAY_MODE, CardsDisplayMode.STACK));
        break;
      }
      case 'restore-cards': {
        this.moveAllCardsToFirstBox().then(() => {
          this.initializeCardsAreInMultipleBoxes();
        });
        break;
      }
      case 'shuffle-cards': {
        this.shuffleCards().then(() => {
        });
        break;
      }
      case 'restore-card-order': {
        this.restoreCardOrder().then(() => {
        });
        break;
      }
      case 'vice-versa': {
        this.toggleViceVersa().then(() => {
          this.initializeViceVersa();
          this.snackbarService.showSnackbar('Flipped all cards');
        });
        break;
      }
      case 'filter-favorites': {
        this.filterService.updateFavorites(true).then(() => {
          this.snackbarService.showSnackbar('Filtered favorites');
        });
        break;
      }
      case 'unfilter-favorites': {
        this.filterService.updateFavorites(false).then(() => {
          this.snackbarService.showSnackbar('Unfiltered favorites');
        });
        break;
      }
      case 'clear-filters': {
        this.filterService.clearAllFilters().then(() => {
          this.snackbarService.showSnackbar('Filters cleared');
        });
        break;
      }
      case 'settings': {
        this.router.navigate(['/settings']).then();
        break;
      }
      case 'download': {
        StacksService.downloadStack(this.stack);
        break;
      }
      case 'android-release': {
        const filename = 'basalt-release.apk';
        const element = document.createElement('a');
        element.setAttribute('href', `assets/${filename}`);
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
   * Handles click on placeholder
   */
  onPlaceholderClicked() {
    this.onCardEvent({action: Action.OPEN_DIALOG_ADD, stack: this.stack, card: null});
  }

  /**
   * Handles key down event
   * @param event event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.code === KEY_CODE_ENTER && event.ctrlKey) {
      this.onCardEvent({action: Action.OPEN_DIALOG_ADD, stack: this.stack, card: null});
    }
  }

  //
  // Helpers
  //

  /**
   * Adds a card
   * @param stack stack
   * @param card card
   */
  private addCard(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cardsService.createCard(stack, card).then(() => {
        this.stacksPersistenceService.clearStacks();
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
        reject();
      });
    });
  }

  /**
   * Updates a card
   * @param stack stack
   * @param card card
   */
  private updateCard(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cardsService.updateCard(stack, card).then(() => {
        this.stacksPersistenceService.clearStacks();
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
        reject();
      });
    });
  }

  /**
   * Deletes a card
   * @param stack stack
   * @param card card
   */
  private deleteCard(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cardsService.deleteCard(stack, card).then(() => {
        this.stacksPersistenceService.clearStacks();
        this.stacksPersistenceService.updateStack(stack).then(() => {
          resolve();
        }).catch(err => {
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
        reject();
      });
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
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
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
          console.error(err);
          reject();
        });
      }).catch(err => {
        console.error(err);
        reject();
      });
    });
  }

  /**
   * Returns cards of the box with a given index
   * @param index box index
   */
  getCardsOfBox(index: number) {
    return this.cards.filter(card => {
      return (card.box == null && index === 0) || card.box === index;
    }).sort(CardsService.sortCards);
  }

  /**
   * Determines whether the tags assigned to a given card already exist, otherwise creates new ones
   * @param stack stack to save tag in
   * @param card card to assign tags to
   * @param tags array of tags to be checked
   */
  private evaluateCardTags(stack: Stack, card: Card, tags: Tag[]) {
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

      card.tagIds = Array.from(aggregatedTagIds.values());
    } else {
      // Unassign tags
      card.tagIds = [];
    }
  }

  /**
   * Restores all cards that have been put aside
   */
  private moveAllCardsToFirstBox(): Promise<any> {
    return new Promise(() => {
      this.cardsService.moveAllCardsToFirstBox(this.stack).then((() => {
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.initializeBoxes(this.stack);
          this.snackbarService.showSnackbar('Moved all cards to first box');
        }).catch(() => {
          this.snackbarService.showSnackbar('Failed to move all cards to first box');
        });
      }));
    });
  }

  /**
   * Shuffles cards
   */
  private shuffleCards(): Promise<any> {
    return new Promise(() => {
      this.cardsService.shuffleStack(this.stack).then((() => {
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.initializeBoxes(this.stack);
          this.snackbarService.showSnackbar('Shuffled cards');
        }).catch(() => {
          this.snackbarService.showSnackbar('Failed to shuffle cards');
        });
      }));
    });
  }

  /**
   * Restores card order (reverse chronological)
   */
  private restoreCardOrder(): Promise<any> {
    return new Promise(() => {
      this.cardsService.restoreCardOrder(this.stack).then((() => {
        this.stacksPersistenceService.updateStack(this.stack).then(() => {
          this.snackbarService.showSnackbar('Restored card order');
        }).catch(() => {
          this.snackbarService.showSnackbar('Failed to restore card order');
        });
      }));
    });
  }

  /**
   * Toggles vice versa
   */
  private toggleViceVersa(): Promise<any> {
    return new Promise((resolve) => {
      this.cardsService.toggleViceVersa();
      resolve();
    });
  }
}
