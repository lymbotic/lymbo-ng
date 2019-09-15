import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Direction, StackConfig, SwingCardComponent, SwingStackComponent, ThrowEvent} from 'angular2-swing';
import {Action} from '../../../../../core/entity/model/action.enum';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {Tag} from '../../../../../core/entity/model/tag/tag.model';
import {Media} from '../../../../../core/ui/model/media.enum';

/**
 * Displays cards as swipable stack
 */
@Component({
  selector: 'app-cards-stack-fragment',
  templateUrl: './cards-stack-fragment.component.html',
  styleUrls: ['./cards-stack-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsStackFragmentComponent {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Array of cards */
  @Input() cards: Card[] = [];
  /** Whether all cards are flipped */
  @Input() viceVersa = false;
  /** Array of tags */
  @Input() tags: Tag[] = [];
  /** Current media */
  @Input() media: Media = Media.UNDEFINED;
  /** Event emitter indicating click on card */
  @Output() cardEventEmitter = new EventEmitter<{ action: Action, stack: Stack, card: Card }>();

  /** Swing stack control */
  @ViewChild('swingStack', {static: false}) swingStack: SwingStackComponent;
  /** Swing cards control */
  @ViewChildren('swingCards') swingCards: QueryList<SwingCardComponent>;

  /** Stack configuration */
  stackConfig: StackConfig;

  /** Enum of media types */
  public mediaType = Media;
  /** Enum of action types */
  public actionType = Action;

  //
  // Actions
  //

  /**
   * Handles throw out of a card
   * @param event throw event
   */
  onCardThrownOut(event: ThrowEvent) {
    switch (event.throwDirection) {
      case Direction.LEFT: {
        this.cardEventEmitter.emit({action: Action.PUT_TO_END, stack: this.stack, card: this.cards[0]});
        break;
      }
      case Direction.RIGHT: {
        this.cardEventEmitter.emit({action: Action.MOVE_TO_NEXT_BOX, stack: this.stack, card: this.cards[0]});
        break;
      }
    }
  }

  /**
   * Handles end of throw out card
   * @param event throw event
   */
  onCardThrownOutEnd(event: ThrowEvent) {
    setTimeout(() => {
      const card = this.swingStack.stack.getCard(event.target);
      if (card != null) {
        card.throwIn(0, 0);
      }
    }, 100);
  }

  /**
   * Handles click on put-to-end button
   */
  onPutToEndClicked() {
    this.cardEventEmitter.emit({action: Action.PUT_TO_END, stack: this.stack, card: this.cards[0]});
  }

  /**
   * Handles click on move-to-next button
   */
  onMoveCardClicked() {
    this.cardEventEmitter.emit({action: Action.MOVE_TO_NEXT_BOX, stack: this.stack, card: this.cards[0]});
  }
}
