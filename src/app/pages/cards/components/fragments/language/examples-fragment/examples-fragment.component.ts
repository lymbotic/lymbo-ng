import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Vocabel} from '../../../../../../core/entity/model/card/example/vocabel.model';
import {Language} from '../../../../../../core/entity/model/card/language.enum';

/**
 * Displays examples
 */
@Component({
  selector: 'app-examples-fragment',
  templateUrl: './examples-fragment.component.html',
  styleUrls: ['./examples-fragment.component.scss']
})
export class ExamplesFragmentComponent implements OnInit {

  /** Examples to be displayed */
  @Input() examples: Vocabel[];
  /** Target source */
  @Input() sourceLanguage: Language;
  /** Target language */
  @Input() targetLanguage: Language;
  /** Placeholder front */
  @Input() placeholderFront = '';
  /** Placeholder back */
  @Input() placeholderBack = '';
  /** Event emitter indicating change in examples */
  @Output() exampleChangedEventEmitter = new EventEmitter<Vocabel[]>();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeExamples();
  }

  //
  // Initialization
  //

  /**
   * Initializes examples
   */
  private initializeExamples() {
    this.examples = this.examples != null ? this.examples.filter(example => {
      return example.source.trim() !== '' && example.target.trim() !== '';
    }) : [];
  }

  //
  // Actions
  //

  /**
   * Handles example changes
   * @param example example
   */
  onExampleChanged(example: Vocabel) {
    this.notify();
  }

  /**
   * Handles click on add button
   */
  onAddButtonClicked() {
    this.examples.push(new Vocabel());
  }

  //
  // Helpers
  //

  /**
   * Determines if there is an empty example
   */
  emptyExampleExists(): boolean {
    return this.examples.length > 0 && this.examples.some(example => {
      return example.source.trim() === '' || example.target.trim() === '';
    });
  }

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.exampleChangedEventEmitter.emit(this.examples);
  }
}
