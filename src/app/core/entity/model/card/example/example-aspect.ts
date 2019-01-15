import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {Vocabel} from './vocabel.model';

/**
 * Represents an example aspect
 */
export class ExampleAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Examples */
  examples: Vocabel[];

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.EXAMPLE;
    this.examples = [];
  }
}
