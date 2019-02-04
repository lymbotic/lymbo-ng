import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';

/**
 * Represents information aspect
 */
export class InformationAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Text */
  text: string;

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.INFORMATION;
    this.text = '';
  }
}
