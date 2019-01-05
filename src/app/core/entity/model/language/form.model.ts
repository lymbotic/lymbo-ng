import {GrammaticalPerson} from './grammatical-person.enum';

/**
 * Represents a verb form
 */
export class Form {

  /** Grammatical person */
  person: GrammaticalPerson;
  /** Value */
  value: string;

  /**
   * Constructor
   * @param person grammatical person
   * @param value value
   */
  constructor(person: GrammaticalPerson, value: string) {
    this.person = person;
    this.value = value;
  }
}
