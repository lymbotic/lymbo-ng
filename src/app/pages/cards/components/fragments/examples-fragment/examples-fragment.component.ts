import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Displays an example
 */
@Component({
  selector: 'app-examples-fragment',
  templateUrl: './examples-fragment.component.html',
  styleUrls: ['./examples-fragment.component.scss']
})
export class ExamplesFragmentComponent {

  /** Example to be displayed */
  @Input() example: string;
  /** Event emitter indicating change in example*/
  @Output() exampleChangedEventEmitter = new EventEmitter<string>();

  //
  // Actions
  //

  /**
   * Handles example changes
   * @param value value
   */
  onExampleChanged(value: string) {
    this.example = value;
    this.exampleChangedEventEmitter.emit(this.example);
  }
}
