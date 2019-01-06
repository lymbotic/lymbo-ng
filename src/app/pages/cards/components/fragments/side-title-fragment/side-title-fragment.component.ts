import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

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
}
