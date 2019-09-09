import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {Stack} from '../../../../../../core/entity/model/stack/stack.model';
import {InformationAspect} from '../../../../../../core/entity/model/card/information/information-aspect.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';

/**
 * Displays an information fragment
 */
@Component({
  selector: 'app-information-fragment',
  templateUrl: './information-fragment.component.html',
  styleUrls: ['./information-fragment.component.scss']
})
export class InformationFragmentComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Information aspect */
  informationAspect: InformationAspect;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeInformationAspect();
  }

  //
  // Initialization
  //

  /**
   * Initializes information aspect
   */
  private initializeInformationAspect() {
    if (this.card != null && this.card.aspects) {
      // Add aspect if not present
      if (!this.card.aspects.some(aspect => {
        return aspect.type === AspectType.INFORMATION;
      })) {
        this.card.aspects.push(new InformationAspect());
      }

      // Get aspect
      this.informationAspect = this.card.aspects.filter(aspect => {
        return aspect.type === AspectType.INFORMATION;
      })[0] as InformationAspect;
    }
  }

  //
  // Actions
  //

  /**
   * Handles text changes
   * @param text text
   */
  onTextChanged(text: string) {
    this.informationAspect.text = text;
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
