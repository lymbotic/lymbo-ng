import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {SuggestionService} from '../../../../../core/entity/services/suggestion.service';
import {DisplayAspect} from '../../../../../core/entity/services/card/card-display.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Stack} from '../../../../../core/entity/model/stack.model';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {CardType} from '../../../../../core/entity/model/card/card-type.enum';
import {AspectType} from '../../../../../core/entity/model/card/aspect.type';
import {Aspect} from '../../../../../core/entity/model/card/aspect.interface';

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

  /**
   * Constructor
   * @param cardsService cards service
   * @param suggestionService suggestion service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private cardsService: CardsService,
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
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
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
    this.tagOptions = Array.from(this.suggestionService.tagOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
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
   * @param card
   */
  onSidesChanged(card: Card) {
    this.card = card;
  }

  // Vocabulary

  /**
   * Handles vocabulary changes
   * @param card
   */
  onVocabularyChanged(card: Card) {
    this.card = card;
  }

  // Quiz

  /**
   * Handles quiz changes
   * @param card
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
      card: this.card,
      tags: this.tags
    });
  }

  /**
   * Handles click on delete button
   */
  deleteCard() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, card: this.card});
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
        if (this.cardsService.containsDisplayAspect(DisplayAspect.CAN_BE_CREATED, this.card)) {
          this.addCard();
        }
        break;
      }
      case DialogMode.UPDATE: {
        if (this.cardsService.containsDisplayAspect(DisplayAspect.CAN_BE_UPDATED, this.card)) {
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
   * @param {Card} card
   * @returns {Tag[]}
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
        case CardType.VOCABULARY: {
          return aspect.type === AspectType.SIDE || aspect.type === AspectType.TENSE || aspect.type === AspectType.EXAMPLE;
        }
        case CardType.QUIZ: {
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
    return this.cardsService.containsDisplayAspect(displayAspect, card);
  }
}
