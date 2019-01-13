import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../../core/entity/model/card.model';
import {Stack} from '../../../../../../core/entity/model/stack.model';
import {Answer} from '../../../../../../core/entity/model/quiz/answer.model';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-fragment.component.html',
  styleUrls: ['./quiz-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizFragmentComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  constructor() {
  }

  ngOnInit() {
  }

  //
  // Actions
  //

  /**
   * Handles question changes
   * @param question question
   */
  onQuestionChanged(question: string) {
    this.card.question = question;
    this.notify();
  }

  /**
   * Handles answer changes
   * @param answers answers
   */
  onAnswersChanged(answers: Answer[]) {
    this.card.answers = answers;
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
