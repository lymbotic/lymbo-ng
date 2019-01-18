import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TenseGroup} from '../../../../../../core/entity/model/card/tense/tense-group';
import {Tense} from '../../../../../../core/entity/model/card/tense/tense.enum';
import {GrammaticalPerson} from '../../../../../../core/entity/model/card/tense/grammatical-person.enum';

/**
 * Displays a single tense
 */
@Component({
  selector: 'app-tense-fragment',
  templateUrl: './tense-fragment.component.html',
  styleUrls: ['./tense-fragment.component.scss']
})
export class TenseFragmentComponent {

  /** Tense group to be displayed */
  @Input() tenseGroup: TenseGroup;
  /** Whether the component is readonly */
  @Input() readonly = false;

  /** Event emitter indicating change in tense group */
  @Output() tenseGroupChangedEventEmitter = new EventEmitter<TenseGroup>();
  /** Event emitter indicating tense deletion */
  @Output() tenseDeletedEventEmitter = new EventEmitter<Tense>();
  /** Event emitter indicating tense clear */
  @Output() tenseClearedEventEmitter = new EventEmitter<Tense>();

  //
  // Actions
  //

  /**
   * Handles click on delete button
   * @param tense tense
   */
  onDeleteTenseClicked(tense: Tense) {
    this.tenseDeletedEventEmitter.emit(tense);
  }

  /**
   * Handles click on clear button
   * @param tense tense
   */
  onClearTenseClicked(tense: Tense) {
    this.tenseClearedEventEmitter.emit(tense);
  }

  /**
   * Handles change in a form
   * @param person grammatical person
   * @param value value
   */
  onFormChanged(person: GrammaticalPerson, value: string) {
    this.tenseGroup.forms.forEach(form => {
      if (form.person === person) {
        form.value = value;
      }
    });

    this.notify();
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  notify() {
    this.tenseGroupChangedEventEmitter.emit(this.tenseGroup);
  }
}
