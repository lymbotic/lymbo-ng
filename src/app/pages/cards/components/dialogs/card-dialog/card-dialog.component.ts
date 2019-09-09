import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {SuggestionService} from '../../../../../core/entity/services/suggestion.service';
import {DisplayAspect} from '../../../../../core/entity/services/card/card-display.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {CardType} from '../../../../../core/entity/model/card/card-type.enum';
import {AspectType} from '../../../../../core/entity/model/card/aspect.type';
import {Aspect} from '../../../../../core/entity/model/card/aspect.interface';
import {Media} from '../../../../../core/ui/model/media.enum';
import {MediaService} from '../../../../../core/ui/services/media.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Tag} from '../../../../../core/entity/model/tag/tag.model';

/**
 * Displays card dialog
 */
@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss'],
})
export class CardDialogComponent implements OnInit, OnDestroy {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Card to be displayed */
  card: Card;
  /** Stack the card is contained in */
  stack: Stack;

  /** Temporarily displayed tags */
  tags: Tag[] = [];
  /** Tag options */
  tagOptions: string[];

  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /** Enum of media types */
  public mediaType = Media;
  /** Current media */
  public media: Media = Media.UNDEFINED;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param cardsService cards service
   * @param mediaService media service
   * @param suggestionService suggestion service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private cardsService: CardsService,
              private mediaService: MediaService,
              private suggestionService: SuggestionService,
              public dialogRef: MatDialogRef<CardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
    this.initializeType();
    this.initializeOptions();

    this.initializeMediaSubscription();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();

    this.handleCardChanges();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.card = this.data.card != null ? CloneService.cloneCard(this.data.card) : new Card();
    this.stack = this.data.stack != null ? CloneService.cloneStack(this.data.stack) : new Stack();
    this.tags = this.data.tags != null ? CloneService.cloneTags(this.data.tags) : [];
  }

  /**
   * Initializes card type
   */
  private initializeType() {
    if (this.card.type == null || this.card.type === CardType.UNSPECIFIED) {
      if (this.stack.sourceLanguage != null) {
        this.card.type = CardType.FREESTYLE;
      }
    }
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.tagOptions = Array.from(this.suggestionService.tagOptions.values()).filter(tag => {
      return this.cardsService.tagIsContainedInCards(this.stack.cards, tag);
    }).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
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
  // Actions
  //

  /**
   * Handles card type changes
   * @param type card type
   */
  onCardTypeChanged(type: CardType) {
    this.card.type = type;
  }

  // Side

  /**
   * Handles sides changes
   * @param card card
   */
  onSidesChanged(card: Card) {
    this.card = card;
  }

  // Vocabulary

  /**
   * Handles tenses changes
   * @param card card
   */
  onTensesChanged(card: Card) {
    this.card = card;
  }

  /**
   * Handles examples changes
   * @param card card
   */
  onExamplesChanged(card: Card) {
    this.card = card;
  }

  // Information

  /**
   * Handles information changes
   * @param card card
   */
  onInformationChanged(card: Card) {
    this.card = card;
  }

  // Quiz

  /**
   * Handles quiz changes
   * @param card card
   */
  onQuizChanged(card: Card) {
    this.card = card;
  }

  // Tags

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t, true);
    });
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addCard() {
    this.tags = this.aggregateTags(this.card);
    this.card.aspects = this.filterUnusedAspects(this.card);

    this.dialogRef.close({
      action: Action.ADD,
      stack: this.stack,
      card: this.card,
      tags: this.tags
    });
  }

  /**
   * Handles click on update button
   */
  updateCard() {
    this.tags = this.aggregateTags(this.card);
    this.card.aspects = this.filterUnusedAspects(this.card);

    this.dialogRef.close({
      action: Action.UPDATE,
      stack: this.stack,
      card: this.card,
      tags: this.tags
    });
  }

  /**
   * Handles click on delete button
   */
  deleteCard() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({
      action: Action.DELETE,
      stack: this.stack,
      card: this.card
    });
  }

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.handleCardChanges();
    }
  }

  /**
   * Handles the creation, updating or continuation of a task
   */
  private handleCardChanges() {
    switch (this.mode) {
      case DialogMode.ADD: {
        if (CardsService.containsDisplayAspect(DisplayAspect.CAN_BE_CREATED, this.card)) {
          this.addCard();
        }
        break;
      }
      case DialogMode.UPDATE: {
        if (CardsService.containsDisplayAspect(DisplayAspect.CAN_BE_UPDATED, this.card)) {
          this.updateCard();
        }
        break;
      }
      case DialogMode.DELETE: {
        break;
      }
      case DialogMode.NONE: {
        break;
      }
    }
  }

  // Tags

  /**
   * Aggregates tags
   * @param card card
   */
  private aggregateTags(card: Card): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.id, t);
    });

    return Array.from(aggregatedTags.values());
  }

  /**
   * Filters unused aspects
   * @param card card
   * @returns {Aspect[]}
   */
  private filterUnusedAspects(card: Card): Aspect[] {
    return card.aspects.filter(aspect => {
      switch (this.card.type) {
        case CardType.FREESTYLE: {
          return aspect.type === AspectType.SIDE;
        }
        case CardType.TENSES: {
          return aspect.type === AspectType.SIDE || aspect.type === AspectType.TENSE;
        }
        case CardType.EXAMPLES: {
          return aspect.type === AspectType.SIDE || aspect.type === AspectType.EXAMPLE;
        }
        case CardType.INFORMATION: {
          return aspect.type === AspectType.INFORMATION;
        }
        case CardType.SINGLE_CHOICE_QUIZ:
        case CardType.MULTIPLE_CHOICE_QUIZ: {
          return aspect.type === AspectType.QUIZ;
        }
      }
    });
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed card contains a specific display aspect
   * @param displayAspect display aspect
   * @param card card
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, card: Card): boolean {
    return CardsService.containsDisplayAspect(displayAspect, card);
  }
}
