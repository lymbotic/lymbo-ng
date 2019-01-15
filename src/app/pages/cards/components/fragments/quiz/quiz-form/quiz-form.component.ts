import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {Answer} from '../../../../../../core/entity/model/card/quiz/answer.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {QuizAspect} from '../../../../../../core/entity/model/card/quiz/quiz-aspect.model';

/**
 * Displays form to set quiz
 */
@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  /** Quiz aspect */
  quizAspect: QuizAspect;

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
