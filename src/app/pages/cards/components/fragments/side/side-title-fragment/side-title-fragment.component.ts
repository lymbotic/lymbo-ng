import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays side title
 */
@Component({
  selector: 'app-side-title-fragment',
  templateUrl: './side-title-fragment.component.html',
  styleUrls: ['./side-title-fragment.component.scss']
})
export class SideTitleFragmentComponent {

  /** Side name to be displayed */
  @Input() sideTitle: string;
  /** Placeholder */
  @Input() placeholder: string;
  /** Readonly dialog if true */
  @Input() readonly: false;
  /** Event emitter indicating changes in side title */
  @Output() sideTitleChangedEmitter = new EventEmitter<string>();
  /** Event emitter indicating a click */
  @Output() sideClickedEmitter = new EventEmitter<any>();

  //
  // Actions
  //

  /**
   * Handles side title changes
   * @param sideTitle side title
   */
  onSideTitleChanged(sideTitle: string) {
    this.sideTitle = sideTitle;
    this.sideTitleChangedEmitter.emit(this.sideTitle);
  }

  /**
   * Handles click on side title
   */
  onSideTitleClicked() {
    this.sideClickedEmitter.emit();
  }
}
