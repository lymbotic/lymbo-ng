import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {Card} from '../../../../../../core/entity/model/card/card.model';
import {Answer} from '../../../../../../core/entity/model/card/quiz/answer.model';
import {AspectType} from '../../../../../../core/entity/model/card/aspect.type';
import {QuizAspect, QuizType} from '../../../../../../core/entity/model/card/quiz/quiz-aspect.model';
import {MatSlideToggleChange} from '@angular/material';

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

  /** Whether single choice is active */
  singleChoice = false;
  /** Whether single choice is impossible */
  singleChoiceImpossible = false;

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeQuizAspect();
    this.initializeSingleChoice();
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

  /**
   * Initialize single choice
   */
  private initializeSingleChoice() {
    this.singleChoice = this.quizAspect.quizType === QuizType.SINGLE_CHOICE;
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
   * Handles changes in single choice selection
   * @param singleChoice
   */
  onSingleChoiceChanged(singleChoice: MatSlideToggleChange) {
    this.singleChoice = singleChoice.checked;
    this.quizAspect.quizType = singleChoice.checked ? QuizType.SINGLE_CHOICE : QuizType.MULTIPLE_CHOICE;
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