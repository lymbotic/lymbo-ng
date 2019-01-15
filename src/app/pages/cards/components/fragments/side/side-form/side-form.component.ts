import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {SideAspect} from '../../../../../../core/entity/model/card/side/side-aspect';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {CardType} from '../../../../../../core/entity/model/card/card-type.enum';

/**
 * Displays form to set side
 */
@Component({
  selector: 'app-side-form',
  templateUrl: './side-form.component.html',
  styleUrls: ['./side-form.component.scss']
})
export class SideFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Placeholder front */
  placeholderFront = '';
  /** Placeholder back */
  placeholderBack = '';

  /** Side aspect */
  sideAspect: SideAspect;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeSideAspect();
    this.initializePlaceholders();
  }

  //
  // Initialization
  //

  /**
   * Initializes side aspect
   */
  private initializeSideAspect() {
    // Add aspect if not present
    if (!this.card.aspects.some(aspect => {
      return aspect.type === AspectType.SIDE;
    })) {
      this.card.aspects.push(new SideAspect());
    }

    // Get aspect
    this.sideAspect = this.card.aspects.filter(aspect => {
      return aspect.type === AspectType.SIDE;
    })[0] as SideAspect;
  }

  /**
   * Initializes placeholders
   */
  private initializePlaceholders() {
    if (this.card.type === CardType.VOCABULARY) {
      this.placeholderFront = this.stack.sourceLanguage;
      this.placeholderBack = this.stack.targetLanguage;
    } else {
      this.placeholderFront = 'Front';
      this.placeholderBack = 'Back';
    }
  }

  //
  // Actions
  //

  /**
   * Handles front side title change
   * @param sideTitle side title
   */
  onFrontTitleChanged(sideTitle: string) {
    this.sideAspect.sides[0].title = sideTitle;
    this.notify();
  }

  /**
   * Handles back side title change
   * @param sideTitle side title
   */
  onBackTitleChanged(sideTitle: string) {
    this.sideAspect.sides[1].title = sideTitle;
    this.notify();
  }

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.cardEventEmitter.emit(this.card);
  }
}
