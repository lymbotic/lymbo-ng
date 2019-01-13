import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../../core/entity/model/card.model';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {TenseGroup} from '../../../../../../core/entity/model/language/tense-group';
import {Vocabel} from '../../../../../../core/entity/model/language/vocabel.model';

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

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }

  //
  // Initialization
  //

  //
  // Actions
  //

  /**
   * Handles tense groups changes
   * @param tenseGroups tense groups
   */
  onTenseGroupsChanged(tenseGroups: TenseGroup[]) {
    this.card.tenseGroups = tenseGroups;
    this.notify();
  }

  /**
   * Handles example changes
   * @param examples examples
   */
  onExampleChanged(examples: Vocabel[]) {
    this.card.examples = examples;
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
