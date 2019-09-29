import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
export class CardsStackFragmentComponent implements OnInit {

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

  /** Factor by which the card is being considered thrown-out, 1=default, 0.5=at half the distance */
  private throwOutFactor = 1;
  /** Number of pixels the card needs to be moved before it counts as swiped */
  private throwOutDistance = 800;

  /** Enum of media types */
  public mediaType = Media;
  /** Enum of action types */
  public actionType = Action;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeThrowOutFactor();
    this.initializeStackConfig();
  }

  //
  // Initialization
  //

  /**
   * Initializes throw-out factor
   */
  private initializeThrowOutFactor() {
    switch (this.media) {
      case Media.LARGE: {
        this.throwOutFactor = 1;
        break;
      }
      case Media.MEDIUM: {
        this.throwOutFactor = 1;
        break;
      }
      case Media.SMALL: {
        this.throwOutFactor = 1;
        break;
      }
    }
  }

  /**
   * Initializes stack config
   */
  private initializeStackConfig() {
    this.throwOutDistance = 800 * this.throwOutFactor;
    this.stackConfig = {
      allowedDirections: [Direction.LEFT, Direction.RIGHT],
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min((Math.abs(offsetX) / (element.offsetWidth / 2)) / this.throwOutFactor, 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: () => {
        return this.throwOutDistance;
      }
    };
  }

  //
  // Actions
  //

  /**
   * Handles moving item
   * @param element element
   * @param x x value
   * @param y y value
   * @param r degrees
   */
  onItemMove(element, x, y, r) {
    element.style.transform = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
    element.style.opacity = 1 - (1.2 * (Math.abs(x) / this.throwOutDistance));
  }

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
