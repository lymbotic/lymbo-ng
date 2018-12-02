import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Card} from '../../../../../core/entity/model/card.model';
import {Side} from '../../../../../core/entity/model/side.model';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {Action} from '../../../../../core/entity/model/action.enum';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styles: [require('./card-fragment.component.scss')],
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

  activeSideIndex = 0;
  activeSide: Side;

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
    this.activeSideIndex++;
    if (this.activeSideIndex >= this.card.sides.length) {
      this.activeSideIndex = 0;
    }

    this.activeSide = this.card.sides[this.activeSideIndex];
  }
}
