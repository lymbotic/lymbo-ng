import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Vocabel} from '../../../../../../core/entity/model/language/vocabel.model';
import {Language} from '../../../../../../core/entity/model/language/language.enum';
import {MicrosoftTranslateService} from '../../../../../../core/translate/services/microsoft-translate.service';

/**
 * Displays an example
 */
@Component({
  selector: 'app-examples-fragment',
  templateUrl: './examples-fragment.component.html',
  styleUrls: ['./examples-fragment.component.scss']
})
export class ExamplesFragmentComponent implements OnInit {

  /** Examples to be displayed */
  @Input() examples: Vocabel[];
  /** Target language */
  @Input() targetLanguage: Language;
  /** Placeholder front */
  @Input() placeholderFront = '';
  /** Placeholder back */
  @Input() placeholderBack = '';
  /** Event emitter indicating change in examples */
  @Output() exampleChangedEventEmitter = new EventEmitter<Vocabel[]>();


  /**
   * Constructor
   * @param microsoftTranslateService Microsoft translate service
   */
  constructor(private microsoftTranslateService: MicrosoftTranslateService) {
  }

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
    this.examples = this.examples.filter(example => {
      return example.source.trim() !== '' && example.target.trim() !== '';
    });
  }

  //
  // Actions
  //

  /**
   * Handles example changes
   * @param example example
   */
  onExampleSourceChanged(example: Vocabel) {
    this.translateExample(example, this.targetLanguage);
    this.notify();
  }

  /**
   * Handles example changes
   */
  onExampleTargetChanged() {
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

  // Translation

  /**
   * Translates a given example
   * @param example example
   * @param targetLanguage target language
   */
  private translateExample(example: Vocabel, targetLanguage: Language) {
    const translationEmitter: EventEmitter<string> = new EventEmitter<string>();
    translationEmitter.subscribe(value => {
      example.target = value;
      this.notify();
    });

    this.microsoftTranslateService.translate(example.source, targetLanguage, translationEmitter);
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
