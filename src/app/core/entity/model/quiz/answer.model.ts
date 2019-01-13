import {SelectableItem} from '../../../../ui/checkable-list/selectable-item';

export class Answer implements SelectableItem {

  /** Text */
  text: string;
  /** Correct */
  selected: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.text = '';
    this.selected = false;
  }
}
