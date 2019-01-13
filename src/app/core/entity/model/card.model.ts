import {Side} from './side.model';
import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';
import {TenseGroup} from './language/tense-group';
import {Vocabel} from './language/vocabel.model';
import {CardType} from './card-type.enum';
import {Answer} from './quiz/answer.model';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Type */
  type: CardType;
  /** Sides */
  sides: Side[];
  /** References to tags */
  tagIds: string[];

  // Preferences

  favorite: boolean;

  // Vocabulary

  /** Verb tenses */
  tenseGroups: TenseGroup[];
  /** Word examples */
  examples: Vocabel[];

  // Quiz

  /** Question */
  question: string;
  /** Answers */
  answers: Answer[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.type = CardType.UNSPECIFIED;
    this.sides = [];
    this.sides.push(new Side());
    this.sides.push(new Side());
    this.tagIds = [];

    this.favorite = false;

    this.tenseGroups = [];
    this.examples = [];

    this.question = '';
    this.answers = [];
  }
}
