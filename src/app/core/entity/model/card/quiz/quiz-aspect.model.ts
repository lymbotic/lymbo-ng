import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {Answer} from './answer.model';

/**
 * Enum containing quiz types
 */
export enum QuizType {
  MULTIPLE_CHOICE = 'multiple choice',
  SINGLE_CHOICE = 'single choice',
}

/**
 * Represents quiz aspect
 */
export class QuizAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Quiz type */
  quizType: QuizType;
  /** Question */
  question: string;
  /** Answers */
  answers: Answer[];

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.QUIZ;
    this.quizType = QuizType.MULTIPLE_CHOICE;
    this.question = '';
    this.answers = [];
  }
}
