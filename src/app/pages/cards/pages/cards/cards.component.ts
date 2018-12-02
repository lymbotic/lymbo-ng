import {Card} from '../../../../core/entity/model/card.model';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {AboutDialogComponent} from '../../../../ui/about-dialog/about-dialog/about-dialog.component';
import {environment} from '../../../../../environments/environment';
import {AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialog, MatDialogConfig, MatIconRegistry, MatSidenav} from '@angular/material';
import {Media} from '../../../../core/ui/model/media.enum';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {Animations, ScrollDirection, ScrollState} from './cards.animation';
import {map, takeUntil} from 'rxjs/operators';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../core/entity/model/stack.model';
import {Tag} from '../../../../core/entity/model/tag.model';
import {MatchService} from '../../../../core/entity/services/match.service';
import {TagService} from '../../../../core/entity/services/tag.service';
import {Action} from '../../../../core/entity/model/action.enum';
import {CloneService} from '../../../../core/entity/services/clone.service';
import {InformationDialogComponent} from '../../../../ui/information-dialog/information-dialog/information-dialog.component';
import {ConfirmationDialogComponent} from '../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {DialogMode} from '../../../../core/entity/model/dialog-mode.enum';
import {TagDialogComponent} from '../../../stacks/components/dialogs/tag-dialog/tag-dialog.component';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {CardDialogComponent} from '../../components/dialogs/card-dialog/card-dialog.component';

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
  title = environment.APP_NAME;

  /** ID passed as an argument */
  id: string;
  /** Stack */
  stack: Stack;
  /** Array of cards */
  cards: Card[] = [];
  /** Array of cards that are put aside */
  cardsPutAside: Card[] = [];
  /** Indicates whether cards are put aside */
  public cardsPutAsideNotEmpty = false;

  /** Map of tags */
  public tagsMap = new Map<string, Tag>();
  /** Array of tags */
  public tags: Tag[] = [];
  /** Array of tags with filter values */
  public tagsFilter: Tag[] = [];

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

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /** Vertical scroll position */
  private scrollPosLast = 0;
  /** Scroll direction */
  public scrollDirection: ScrollDirection = ScrollDirection.UP;
  /** Scroll state */
  public scrollState: ScrollState = ScrollState.NON_SCROLLING;

  /** Sidenav state */
  public sidenavOpened = true;

  /** Side navigation at start */
  @ViewChild('sidenavStart') sidenavStart: MatSidenav;
  /** Side navigation at end */
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  /** Scrollable directive */
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  /**
   * Constructor
   * @param cardsService
   * @param filterService
   * @param iconRegistry
   * @param matchService
   * @param materialColorService
   * @param materialIconService
   * @param mediaService
   * @param route
   * @param router
   * @param sanitizer
   * @param scroll
   * @param settingsService
   * @param stacksService
   * @param snackbarService
   * @param suggestionService
   * @param tagService
   * @param dialog
   * @param zone
   */
  constructor(private cardsService: CardsService,
              private filterService: FilterService,
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
              private stacksService: StacksService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService,
              private tagService: TagService,
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
    this.tagsMap = new Map(this.tagService.tags);

    this.initializeParameters();
    this.initializeResolvedData();
    this.initializeStackSubscription();
    this.initializeCardSubscription();

    this.initializeFilterSubscription();
    this.initializeTagSubscription();
    this.initializeSuggestionSubscription();

    this.initializeMaterial();
    this.initializeMediaSubscription();

    this.initializeSettings();

    this.clearFilters();
    this.findEntities();

    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.findEntities();
    });
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
      this.initializeStack(resolved as Stack);
    }
  }

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    this.stacksService.stackSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      if (value != null) {
        this.initializeStack(value as Stack);
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
      }
    });
  }

  // Stack

  /**
   * Initializes stack
   * @param stack stack
   */
  private initializeStack(stack: Stack) {
    this.stack = stack;

    if (stack != null) {
      this.initializeTitle(stack);
      this.cardsService.initializeStack(stack);
      this.cardsService.initializeCards(stack.cards);
    }
  }

  // Cards

  /**
   * Initializes cards by filtering them
   * @param cards cards
   */
  private initializeCards(cards: Card[]) {
    this.cards = cards.filter(card => {
      return this.filterCard(card);
    });
  }

  /**
   * Checks if a card matches current filter criteria
   * @param card card
   */
  private filterCard(card: Card) {
    const matchesSearchItem = this.matchService.cardMatchesEveryItem(card, this.filterService.searchItem);
    const matchesTags = this.matchService.cardMatchesTags(card, Array.from(this.filterService.tags.values()));
    const isNotPutAside = !this.cardsPutAside.some(cardPutAside => {
      return cardPutAside.id === card.id;
    });

    return matchesSearchItem && matchesTags && isNotPutAside;
  }

  // Tags

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagService.tagsSubject.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe((value) => {
      // Create new instance to trigger change detection of child components
      this.tagsMap = new Map(this.tagService.tags);

      if (value != null) {
        this.initializeTags(value as Tag[]);
      }
    });
  }

  /**
   * Initializes tags by filtering them
   * @param tags tags
   */
  private initializeTags(tags: Tag[]) {
    this.tags = tags.filter(tag => {
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

      // Filter cards
      this.cards = Array.from(this.cardsService.cards.values()).filter((card: Card) => {
        return this.filterCard(card);
      }).sort(this.cardsService.sortCards);
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
   * Initializes material colors and icons
   */
  private initializeMaterial() {
    this.materialColorService.initializeColors();
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

  /**
   * Initializes settings
   */
  private initializeSettings() {
    this.settingsService.fetch();
  }

  /**
   * Clears all filters
   */
  private clearFilters() {
    this.filterService.clearAllFilters();
  }

  /**
   * Triggers entity retrieval from database
   */
  private findEntities() {
    this.stacksService.findStackByID(this.id);
    this.tagService.findTags();
  }

  /**
   * Initializes title
   * @param stack stack
   */
  private initializeTitle(stack: Stack) {
    this.title = stack != null ? stack.title : this.title;
  }

  //
  // Actions
  //

  /**
   * Handles click on add card button
   */
  onAddCardClicked() {
    this.onCardEvent({action: Action.OPEN_DIALOG_ADD, card: null});
  }

  /**
   * Handles events targeting a card
   * @param {any} event event parameters
   */
  onCardEvent(event: { action: Action, card: Card, tags?: Tag[] }) {
    const card = CloneService.cloneCard(event.card as Card);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        // Create new entities if necessary
        this.evaluateCardTags(card, tags);

        // Create card itself
        this.cardsService.createCard(card).then(() => {
          this.snackbarService.showSnackbar('Added card');
        });
        break;
      }
      case Action.UPDATE: {
        // Create new entities if necessary
        this.evaluateCardTags(card, tags);

        // Update card itself
        this.cardsService.updateCard(card).then(() => {
          this.snackbarService.showSnackbar('Updated card');
        });
        break;
      }
      case Action.PUT_ASIDE: {
        this.putCardAside(card).then(() => {
          this.snackbarService.showSnackbar('Put card aside');
        });
        this.initializeCards(this.cards);
        break;
      }
      case Action.PUT_TO_END: {
        this.cardsService.putCardToEnd(this.stack, card).then(() => {
          this.snackbarService.showSnackbar('Put card to end');
        });
        break;
      }
      case Action.DELETE: {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
            this.cardsService.deleteCard(confirmationResult as Card).then(() => {
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
          tags: []
        };

        // Open dialog
        const dialogRef = this.dialog.open(CardDialogComponent, {
          disableClose: false,
          data: data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingCard = result.card as Card;
            const resultingTags = result.tags as Tag[];

            this.onCardEvent({
              action: resultingAction,
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
          card: card,
          tags: card.tagIds.map(id => {
            return this.tagService.tags.get(id);
          }).filter(tag => {
            return tag != null;
          })
        };

        // Open dialog
        const dialogRef = this.dialog.open(CardDialogComponent, {
          disableClose: false,
          data: data
        });

        // Handle dialog close
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            const resultingAction = result.action as Action;
            const resultingCard = result.card as Card;
            const resultingTags = result.tags as Tag[];

            this.onCardEvent({
              action: resultingAction,
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
   * @param {any} event event parameters
   */
  onTagEvent(event: { action: Action, tag?: Tag, tags?: Tag[] }) {
    const tag = CloneService.cloneTag(event.tag as Tag);
    const tags = CloneService.cloneTags(event.tags as Tag[]);

    switch (event.action) {
      case Action.ADD: {
        this.filterService.updateTagsListIfNotEmpty([tag]);
        this.tagService.createTag(tag).then(() => {
        });
        break;
      }
      case Action.UPDATE: {
        this.filterService.updateTagsListIfNotEmpty([tag]);
        this.tagService.updateTag(tag).then(() => {
        });
        break;
      }
      case Action.DELETE: {
        const referencesStacks = Array.from(this.stacksService.stacks.values()).some((stack: Stack) => {
          return stack.tagIds != null && stack.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });
        const referencesCards = Array.from(this.cardsService.cards.values()).some((card: Card) => {
          return card.tagIds != null && card.tagIds.some(tagId => {
            return tagId === tag.id;
          });
        });

        if (referencesStacks || referencesCards) {
          this.dialog.open(InformationDialogComponent, <MatDialogConfig>{
            disableClose: false,
            data: {
              title: 'Cannot delete tag',
              text: `There are still tasks associated with this tag.`,
              action: 'Okay',
              value: tag
            }
          });
        } else {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, <MatDialogConfig>{
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
              this.tagService.deleteTag(confirmationResult as Tag).then(() => {
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
          tag: new Tag('')
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
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'back': {
        this.cardsService.clearCards();
        this.router.navigate([`/stacks`]);
        break;
      }
      case 'restore-cards': {
        this.restoreCards().then(() => {
          this.snackbarService.showSnackbar('Restored cards that have been put aside');
        });
        break;
      }
      case 'clear-filter': {
        this.filterService.clearAllFilters().then(() => {
          this.snackbarService.showSnackbar('Filters cleared');
        });
        break;
      }
      case 'settings': {
        this.router.navigate(['/settings']);
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
        this.dialog.open(AboutDialogComponent, <MatDialogConfig>{
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
   * @param {string} searchItem new search item
   */
  onSearchItemChanged(searchItem: string) {
    this.filterService.updateSearchItem(searchItem);
  }

  /**
   * Determines whether the tags assigned to a given card already exist, otherwise creates new ones
   * @param {card} card task assign tags to
   * @param {Tag[]} tags array of tags to be checked
   */
  private evaluateCardTags(card: Card, tags: Tag[]) {
    if (tags != null) {
      const aggregatedTagIds = new Map<string, string>();

      // New tag
      tags.forEach(t => {
        let tag = this.tagService.getTagByName(t.name);

        if (tag == null) {
          tag = new Tag(t.name, true);
          this.tagService.createTag(tag).then(() => {
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
   * Puts a card aside
   * @param card card
   */
  private putCardAside(card: Card): Promise<any> {
    return new Promise(() => {
      this.cardsPutAside.push(card);
      this.cardsPutAsideNotEmpty = this.cardsPutAside.length > 0;
    });
  }

  /**
   * Restores all cards that have been put aside
   */
  private restoreCards(): Promise<any> {
    return new Promise(() => {
      const cardsAll = this.cards.concat(this.cardsPutAside).sort(this.cardsService.sortCards);
      this.cardsPutAside = [];
      this.initializeCards(cardsAll);
    });
  }
}
