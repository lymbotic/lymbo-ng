import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Vocabel} from '../../../../../../core/entity/model/language/vocabel.model';

/**
 * Displays a single example
 */
@Component({
  selector: 'app-example-fragment',
  templateUrl: './example-fragment.component.html',
  styleUrls: ['./example-fragment.component.scss']
})
export class ExampleFragmentComponent {

  /** Examples to be displayed */
  @Input() example: Vocabel;
  /** Placeholder front */
  @Input() placeholderFront = '';
  /** Placeholder back */
  @Input() placeholderBack = '';
  /** Whether the component is readonly */
  @Input() readonly = false;

  /** Event emitter indicating change in source example */
  @Output() exampleSourceChangedEventEmitter = new EventEmitter<Vocabel>();
  /** Event emitter indicating change in target example */
  @Output() exampleTargetChangedEventEmitter = new EventEmitter();

  //
  // Actions
  //

  /**
   * Handles example changes
   * @param example example
   */
  onExampleSourceChanged(example: Vocabel) {
    this.exampleSourceChangedEventEmitter.emit(example);
  }

  /**
   * Handles example changes
   */
  onExampleTargetChanged() {
    this.exampleTargetChangedEventEmitter.emit();
  }
}
