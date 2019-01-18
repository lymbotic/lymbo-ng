import {Aspect} from '../aspect.interface';
import {AspectType} from '../aspect.type';
import {Side} from './side.model';

/**
 * Represents side aspect
 */
export class SideAspect implements Aspect {

  /** Type */
  type: AspectType;
  /** Sides */
  sides: Side[];

  /**
   * Constructor
   */
  constructor() {
    this.type = AspectType.SIDE;
    this.sides = [];
    this.sides.push(new Side());
    this.sides.push(new Side());
  }
}
