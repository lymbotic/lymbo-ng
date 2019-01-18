import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {TenseAspect} from '../../../../../../core/entity/model/card/tense/tense-aspect';
import {ExampleAspect} from '../../../../../../core/entity/model/card/example/example-aspect';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {TenseGroup} from '../../../../../../core/entity/model/card/tense/tense-group';
import {Vocabel} from '../../../../../../core/entity/model/card/example/vocabel.model';

/**
 * Displays form to set vocabulary properties
 */
@Component({
  selector: 'app-vocabulary-form',
  templateUrl: './vocabulary-form.component.html',
  styleUrls: ['./vocabulary-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyFormComponent implements OnInit {

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
    this.initializeExampleAspect();
  }

  //
  // Initialization
  //

  /**
   * Initializes tense aspect
   */
  private initializeTenseAspect() {
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

  /**
   * Initializes example aspect
   */
  private initializeExampleAspect() {
    // Add aspect if not present
    if (!this.card.aspects.some(aspect => {
      return aspect.type === AspectType.EXAMPLE;
    })) {
      this.card.aspects.push(new ExampleAspect());
    }

    // Get aspect
    this.exampleAspect = this.card.aspects.filter(aspect => {
      return aspect.type === AspectType.EXAMPLE;
    })[0] as ExampleAspect;
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

  /**
   * Handles example changes
   * @param examples examples
   */
  onExampleChanged(examples: Vocabel[]) {
    this.exampleAspect.examples = examples;
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
