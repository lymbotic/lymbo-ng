import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {Answer} from './answer.model';

/**
 * Enum containing quiz types
 */
export enum QuizType {
  SELECT = 'Select',
  CHOOSE = 'Choose',
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
    this.quizType = QuizType.SELECT;
    this.question = '';
    this.answers = [];
  }
}
