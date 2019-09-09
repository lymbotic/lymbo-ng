import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {Stack} from '../../../../../../core/entity/model/stack/stack.model';
import {Media} from '../../../../../../core/ui/model/media.enum';
import {QuizAspect} from '../../../../../../core/entity/model/card/quiz/quiz-aspect.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {Answer} from '../../../../../../core/entity/model/card/quiz/answer.model';

/**
 * Displays quiz form
 */
@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss']
})
export class QuizFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Current media */
  @Input() media: Media = Media.UNDEFINED;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Quiz aspect */
  quizAspect: QuizAspect;

  /** Whether single choice is active */
  singleChoice = false;
  /** Whether single choice is impossible */
  singleChoiceImpossible = false;

  /** Enum of media types */
  mediaType = Media;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeQuizAspect();
  }

  //
  // Initialization
  //

  /**
   * Initializes quiz aspect
   */
  private initializeQuizAspect() {
    if (this.card != null && this.card.aspects != null) {
      // Add aspect if not present
      if (!this.card.aspects.some(aspect => {
        return aspect.type === AspectType.QUIZ;
      })) {
        this.card.aspects.push(new QuizAspect());
      }

      // Get aspect
      this.quizAspect = this.card.aspects.filter(aspect => {
        return aspect.type === AspectType.QUIZ;
      })[0] as QuizAspect;
    }
  }

  //
  // Actions
  //

  /**
   * Handles question changes
   * @param question question
   */
  onQuestionChanged(question: string) {
    this.quizAspect.question = question;
    this.notify();
  }

  /**
   * Handles answer changes
   * @param answers answers
   */
  onAnswersChanged(answers: Answer[]) {
    this.quizAspect.answers = answers;

    if (this.quizAspect.answers.filter(answer => {
      return answer.selected;
    }).length === 1) {
      this.singleChoiceImpossible = false;
    } else {
      this.singleChoice = false;
      this.singleChoiceImpossible = true;
    }
    this.notify();
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
