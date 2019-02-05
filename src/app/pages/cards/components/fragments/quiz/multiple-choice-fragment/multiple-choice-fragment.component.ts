import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectableItem} from '../../../../../../ui/checkable-list/selectable-item';

/**
 * Represents a simple selectable item
 */
class Item implements SelectableItem {

  /** Text */
  text: string;
  /** Selected */
  selected: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.text = '';
    this.selected = false;
  }
}

/**
 * Displays multiple choice fragment
 */
@Component({
  selector: 'app-multiple-choice-fragment',
  templateUrl: './multiple-choice-fragment.component.html',
  styleUrls: ['./multiple-choice-fragment.component.scss']
})
export class MultipleChoiceFragmentComponent {

  /** Items to be displayed */
  @Input() items: SelectableItem[] = [];
  /** Placeholder for new entry */
  @Input() newEntryPlaceholder = 'List entry';
  /** Whether component is readonly or not */
  @Input() readonly = false;
  /** Whether component's structure can be edited */
  @Input() editable = true;
  /** Event emitter indicating items changes */
  @Output() itemsChangedEmitter = new EventEmitter<SelectableItem[]>();

  //
  // Actions
  //

  /**
   * Handles answer changes
   * @param answers answers
   */
  onAnswersChanged(answers: SelectableItem[]) {
    this.itemsChangedEmitter.emit(answers);
  }
}
