import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack/stack.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {TenseAspect} from '../../../../../../core/entity/model/card/tense/tense-aspect';
import {ExampleAspect} from '../../../../../../core/entity/model/card/example/example-aspect';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {TenseGroup} from '../../../../../../core/entity/model/card/tense/tense-group';
import {Vocabel} from '../../../../../../core/entity/model/card/example/vocabel.model';

/**
 * Displays form to set tenses
 */
@Component({
  selector: 'app-tenses-form',
  templateUrl: './tenses-form.component.html',
  styleUrls: ['./tenses-form.component.scss']
})
export class TensesFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Tense aspect */
  tenseAspect: TenseAspect;
  /** Example aspect */
  exampleAspect: ExampleAspect;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeTenseAspect();
  }

  //
  // Initialization
  //

  /**
   * Initializes tense aspect
   */
  private initializeTenseAspect() {
    if (this.card != null && this.card.aspects != null) {
      // Add aspect if not present
      if (!this.card.aspects.some(aspect => {
        return aspect.type === AspectType.TENSE;
      })) {
        this.card.aspects.push(new TenseAspect());
      }

      // Get aspect
      this.tenseAspect = this.card.aspects.filter(aspect => {
        return aspect.type === AspectType.TENSE;
      })[0] as TenseAspect;
    }
  }

  //
  // Actions
  //

  /**
   * Handles tense groups changes
   * @param tenseGroups tense groups
   */
  onTenseGroupsChanged(tenseGroups: TenseGroup[]) {
    this.tenseAspect.tenseGroups = tenseGroups;
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
