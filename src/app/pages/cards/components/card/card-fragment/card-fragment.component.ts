import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Card} from '../../../../../core/entity/model/card.model';
import {Side} from '../../../../../core/entity/model/side.model';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {Action} from '../../../../../core/entity/model/action.enum';
import {TenseGroup} from '../../../../../core/entity/model/language/tense-group';
import {Vocabel} from '../../../../../core/entity/model/language/vocabel.model';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFragmentComponent implements OnInit {

  /** Card to be displayed */
  @Input() card = new Card();
  /** Map of tags */
  @Input() tags = new Map<string, Tag>();
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on card */
  @Output() cardEventEmitter = new EventEmitter<{ action: Action, card: Card }>();

  /** Enum of action types */
  public actionType = Action;

  /** Index of active side */
  activeSideIndex = 0;
  /** Active side */
  activeSide: Side;

  /** Index of active side */
  activeTenseGroupIndex = 0;
  /** Active tense group */
  activeTenseGroup: TenseGroup;

  /** Index of active side */
  activeExampleIndex = 0;
  /** Active example */
  activeExample: Vocabel;

  /**
   * Constructor
   * @param cardsService card service
   * @param snackbarService snack bar service
   * @param dialog dialog
   */
  constructor(private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.activeSide = this.card.sides[this.activeSideIndex];
    this.activeTenseGroup = null;
  }

  //
  // Actions
  //

  /**
   * Handles click on the card
   */
  onCardClicked(action: Action) {
    switch (action) {
      case Action.NONE: {
        this.flipCard();
        break;
      }
      default: {
        this.cardEventEmitter.emit({action: action, card: this.card});
      }
    }
  }

  /**
   * Flips card to the next side
   */
  private flipCard() {
    const totalSides = this.card.sides != null ? this.card.sides.length : 0;
    const totalTenseGroups = this.card.tenseGroups != null ? this.card.tenseGroups.length : 0;
    const totalExamples = this.card.examples != null ? this.card.examples.length : 0;

    // Increase index and loop if needed
    if (this.activeSide != null) {
      this.activeSideIndex++;
      this.activeSide = this.card.sides[this.activeSideIndex];

      if (this.activeSideIndex >= totalSides) {
        if (this.card.tenseGroups != null && this.card.tenseGroups.length > 0) {
          this.switchToTenses();
        } else if (this.card.examples != null && this.card.examples.length > 0) {
          this.switchToExamples();
        } else if (this.card.sides != null && this.card.sides.length > 0) {
          this.switchToSides();
        }
      }
    } else if (this.activeTenseGroup != null) {
      this.activeTenseGroupIndex++;
      this.activeTenseGroup = this.card.tenseGroups[this.activeTenseGroupIndex];

      if (this.activeTenseGroupIndex >= totalTenseGroups) {
        if (this.card.examples != null && this.card.examples.length > 0) {
          this.switchToExamples();
        } else if (this.card.sides != null && this.card.sides.length > 0) {
          this.switchToSides();
        }
      }
    } else if (this.activeExample != null) {
      this.activeExampleIndex++;
      this.activeExample = this.card.examples[this.activeExampleIndex];

      if (this.activeExampleIndex >= totalExamples) {
        if (this.card.sides != null && this.card.sides.length > 0) {
          this.switchToSides();
        }
      }
    }
  }

  /**
   * Switches to tenses
   */
  private switchToTenses() {
    this.activeTenseGroupIndex = 0;
    this.activeSide = null;
    this.activeTenseGroup = this.card.tenseGroups[this.activeTenseGroupIndex];
    this.activeExample = null;
  }

  /**
   * Switches to examples
   */
  private switchToExamples() {
    this.activeExampleIndex = 0;
    this.activeSide = null;
    this.activeTenseGroup = null;
    this.activeExample = this.card.examples[this.activeExampleIndex];
  }

  /**
   * Switches to sides
   */
  private switchToSides() {
    this.activeSideIndex = 0;
    this.activeSide = this.card.sides[this.activeSideIndex];
    this.activeTenseGroup = null;
    this.activeExample = null;
  }
}
