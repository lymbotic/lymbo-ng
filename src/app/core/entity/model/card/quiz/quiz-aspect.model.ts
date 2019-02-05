import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {Answer} from './answer.model';

/**
 * Represents quiz aspect
 */
export class QuizAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Question */
  question: string;
  /** Answers */
  answers: Answer[];

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.QUIZ;
    this.question = '';
    this.answers = [];
  }
}
