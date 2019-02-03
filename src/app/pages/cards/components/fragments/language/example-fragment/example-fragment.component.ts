import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Vocabel} from '../../../../../../core/entity/model/card/example/vocabel.model';
import {Subject} from 'rxjs';
import {MicrosoftTranslateService} from '../../../../../../core/translate/services/microsoft-translate.service';
import {Language} from '../../../../../../core/entity/model/card/language.enum';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../../../../../environments/environment';

/**
 * Displays a single example
 */
@Component({
  selector: 'app-example-fragment',
  templateUrl: './example-fragment.component.html',
  styleUrls: ['./example-fragment.component.scss']
})
export class ExampleFragmentComponent implements OnInit {

  /** Examples to be displayed */
  @Input() example: Vocabel;
  /** Target source */
  @Input() sourceLanguage: Language;
  /** Target language */
  @Input() targetLanguage: Language;
  /** Placeholder front */
  @Input() placeholderFront = '';
  /** Placeholder back */
  @Input() placeholderBack = '';
  /** Whether the component is readonly */
  @Input() readonly = false;

  /** Event emitter indicating change in example */
  @Output() exampleChangedEventEmitter = new EventEmitter<Vocabel>();

  /** Subject of front title changes */
  private exampleSourceChangedSubject = new Subject<string>();
  /** Subject of back title changes */
  private exampleTargetChangedSubject = new Subject<string>();

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
    this.initializeExampleChangedSubject(this.exampleSourceChangedSubject, this.targetLanguage, 0, 1);
    this.initializeExampleChangedSubject(this.exampleTargetChangedSubject, this.sourceLanguage, 1, 0);
  }

  //
  // Initialization
  //

  /**
   * Initializes side subject
   * @param subject subject
   * @param targetLanguage target language
   * @param sourceIndex index of source side
   * @param targetIndex index of source side
   */
  private initializeExampleChangedSubject(subject: Subject<string>, targetLanguage: Language, sourceIndex: number, targetIndex: number) {
    subject.pipe(
      debounceTime(environment.TRANSLATE_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(() => {
      if (targetLanguage != null) {
        const originalText = sourceIndex === 0 ? this.example.source : this.example.target;

        this.translateText(originalText, targetLanguage).subscribe(translatedText => {
          if (targetIndex === 0) {
            this.example.source = translatedText;
          } else {
            this.example.target = translatedText;
          }

          this.notify();
        });
      }
    });
  }

  //
  // Actions
  //

  /**
   * Handles example changes
   * @param source source
   */
  onExampleSourceChanged(source: string) {
    this.example.source = source;
    this.notify();
  }

  /**
   * Handles click on example source
   */
  onExampleSourceClicked() {
    // Check if source is empty
    if (this.example.target.trim() !== ''
      && (this.example.source === null || this.example.source.trim() === '')) {
      this.exampleTargetChangedSubject.next(this.example.target);
    }
  }

  /**
   * Handles example changes
   * @param target target
   */
  onExampleTargetChanged(target: string) {
    this.example.target = target;
    this.notify();
  }

  /**
   * Handles click on target source
   */
  onExampleTargetClicked() {
    // Check if target is empty
    if (this.example.source.trim() !== ''
      && (this.example.target === null || this.example.target.trim() === '')) {
      this.exampleSourceChangedSubject.next(this.example.source);
    }
  }

  //
  // Helpers
  //

  /**
   * Translates a given text and uses it as the back title
   * @param text text
   * @param targetLanguage target tense
   * @return {EventEmitter<string>}
   */
  private translateText(text: string, targetLanguage: Language): EventEmitter<string> {
    const translationEmitter: EventEmitter<string> = new EventEmitter<string>();
    this.microsoftTranslateService.translate(text, targetLanguage, translationEmitter);

    return translationEmitter;
  }

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.exampleChangedEventEmitter.emit(this.example);
  }
}
