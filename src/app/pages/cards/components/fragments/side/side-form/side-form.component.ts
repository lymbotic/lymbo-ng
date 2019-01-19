import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {SideAspect} from '../../../../../../core/entity/model/card/side/side-aspect';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {CardType} from '../../../../../../core/entity/model/card/card-type.enum';
import {Subject} from 'rxjs';
import {MicrosoftTranslateService} from '../../../../../../core/translate/services/microsoft-translate.service';
import {Language} from '../../../../../../core/entity/model/card/language.enum';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../../../../../environments/environment';

/**
 * Displays form to set side
 */
@Component({
  selector: 'app-side-form',
  templateUrl: './side-form.component.html',
  styleUrls: ['./side-form.component.scss']
})
export class SideFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Placeholder front */
  placeholderFront = '';
  /** Placeholder back */
  placeholderBack = '';

  /** Side aspect */
  sideAspect: SideAspect;

  /** Subject of front title changes */
  private frontTitleChangedSubject = new Subject<string>();
  /** Subject of back title changes */
  private backTitleChangedSubject = new Subject<string>();

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
    this.initializeSideAspect();
    this.initializePlaceholders();

    this.initializeTitleChangedSubject(this.frontTitleChangedSubject, this.stack.targetLanguage, 0, 1);
    this.initializeTitleChangedSubject(this.backTitleChangedSubject, this.stack.sourceLanguage, 1, 0);
  }

  //
  // Initialization
  //

  /**
   * Initializes side aspect
   */
  private initializeSideAspect() {
    // Add aspect if not present
    if (!this.card.aspects.some(aspect => {
      return aspect.type === AspectType.SIDE;
    })) {
      this.card.aspects.push(new SideAspect());
    }

    // Get aspect
    this.sideAspect = this.card.aspects.filter(aspect => {
      return aspect.type === AspectType.SIDE;
    })[0] as SideAspect;
  }

  /**
   * Initializes placeholders
   */
  private initializePlaceholders() {
    if (this.card.type === CardType.VOCABULARY) {
      this.placeholderFront = this.stack.sourceLanguage;
      this.placeholderBack = this.stack.targetLanguage;
    } else {
      this.placeholderFront = 'Front';
      this.placeholderBack = 'Back';
    }
  }

  /**
   * Initializes side subject
   * @param subject subject
   * @param targetLanguage target language
   * @param sourceIndex index of source side
   * @param targetIndex index of source side
   */
  private initializeTitleChangedSubject(subject: Subject<string>, targetLanguage: Language, sourceIndex: number, targetIndex: number) {
    subject.pipe(
      debounceTime(environment.TRANSLATE_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(() => {
      if (targetLanguage != null) {
        if (this.sideAspect != null) {
          const originalText = this.sideAspect.sides[sourceIndex].title;

          this.translateText(originalText, targetLanguage).subscribe(translatedText => {
            this.sideAspect.sides[targetIndex].title = translatedText;
          });
        }
      }
    });
  }

  //
  // Actions
  //

  /**
   * Handles front side title change
   * @param sideTitle side title
   */
  onFrontTitleChanged(sideTitle: string) {
    this.sideAspect.sides[0].title = sideTitle;
    this.frontTitleChangedSubject.next(sideTitle);
    this.notify();
  }

  /**
   * Handles back side title change
   * @param sideTitle side title
   */
  onBackTitleChanged(sideTitle: string) {
    this.sideAspect.sides[1].title = sideTitle;
    this.backTitleChangedSubject.next(sideTitle);
    this.notify();
  }

  //
  // Helpers
  //

  // Translation

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
    this.cardEventEmitter.emit(this.card);
  }
}
