import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {Card} from '../../../../../core/entity/model/card.model';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {SuggestionService} from '../../../../../core/entity/services/suggestion.service';
import {DisplayAspect} from '../../../../../core/entity/services/card/card-display.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {MicrosoftTranslateService} from '../../../../../core/translate/services/microsoft-translate.service';
import {Language} from '../../../../../core/entity/model/language.enum';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';

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
  /** Target language */
  targetLanguage: Language;

  /** Temporarily displayed tags */
  tags: Tag[] = [];

  /** Tag options */
  tagOptions: string[];

  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /** Subject of front title changes */
  private frontTitleChangedSubject = new Subject<string>();

  /**
   * Constructor
   * @param cardsService cards service
   * @param microsoftTranslateService Microsoft translate service
   * @param suggestionService suggestion service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private cardsService: CardsService,
              private microsoftTranslateService: MicrosoftTranslateService,
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
    this.initializeOptions();
    this.initializeFrontTitleChangedSubject();
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
    this.targetLanguage = this.data.targetLanguage != null ? CloneService.cloneLanguage(this.data.targetLanguage) : Language.UNSPECIFIED;
    this.tags = this.data.tags != null ? CloneService.cloneTags(this.data.tags) : [];
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

  /**
   * Initializes front title subject
   */
  private initializeFrontTitleChangedSubject() {
    this.frontTitleChangedSubject.pipe(
      debounceTime(environment.TRANSLATE_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.targetLanguage != null) {
        this.translateText(this.card.sides[0].title, this.targetLanguage);
      }
    });
  }

  //
  // Actions
  //

  /**
   * Handles front side title change
   * @param sideTitle side title
   */
  onFrontTitleChanged(sideTitle: string) {
    this.card.sides[0].title = sideTitle;
    this.frontTitleChangedSubject.next(sideTitle);
  }

  /**
   * Handles back side title change
   * @param sideTitle side title
   */
  onBackTitleChanged(sideTitle: string) {
    this.card.sides[1].title = sideTitle;
  }

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

  //
  // Helpers
  //

  // Translation

  /**
   * Translates a given text and uses it as the back title
   * @param text text
   * @param targetLanguage target language
   */
  private translateText(text: string, targetLanguage: Language) {
    const translationEmitter: EventEmitter<string> = new EventEmitter<string>();
    translationEmitter.subscribe(value => {
      this.onBackTitleChanged(value);
    });

    this.microsoftTranslateService.translate(text, targetLanguage, translationEmitter);
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
