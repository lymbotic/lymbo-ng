import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {TenseGroup} from './tense-group';

/**
 * Represents a tense aspect
 */
export class TenseAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Tense groups */
  tenseGroups: TenseGroup[];

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.TENSE;
    this.tenseGroups = [];
  }
}
