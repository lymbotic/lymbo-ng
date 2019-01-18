import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectableItem} from '../../../../../../ui/checkable-list/selectable-item';
import {Answer} from '../../../../../../core/entity/model/card/quiz/answer.model';

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
 * Displays single choice fragment
 */
@Component({
  selector: 'app-single-choice-fragment',
  templateUrl: './single-choice-fragment.component.html',
  styleUrls: ['./single-choice-fragment.component.scss']
})
export class SingleChoiceFragmentComponent {

  /** Items to be displayed */
  @Input() items: SelectableItem[] = [];
  /** Placeholder for new entry */
  @Input() newEntryPlaceholder = 'List entry';
  /** Whether component is readonly or not */
  @Input() readonly = false;
  /** Whether component's structure can be edited */
  @Input() editable = true;
  /** Event emitter indicating items changes */
  @Output() itemsChangedEmitter = new EventEmitter<SelectableItem>();

  //
  // Actions
  //

  /**
   * Handles click on answer
   * @param answer answer
   */
  onAnswerClicked(answer: SelectableItem) {
    this.itemsChangedEmitter.emit(answer);
  }
}
