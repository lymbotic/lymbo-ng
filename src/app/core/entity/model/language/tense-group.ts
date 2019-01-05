import {Tense} from './tense.enum';
import {Form} from './form.model';

/**
 * Represents a tense group
 */
export class TenseGroup {

  /** Name of this tense */
  tense: Tense;
  /** Forms */
  forms: Form[];

  /**
   * Constructor
   */
  constructor() {
    this.tense = Tense.UNDEFINED;
    this.forms = [];
  }
}
