import {Side} from './side.model';
import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';
import {TenseGroup} from './language/tense-group';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Sides */
  sides: Side[];
  /** References to tags */
  tagIds: string[];

  // Language

  /** Verb tenses */
  tenseGroups: TenseGroup[];
  /** Word example */
  example: string;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.sides = [];
    this.sides.push(new Side());
    this.sides.push(new Side());
    this.tagIds = [];

    this.tenseGroups = [];
    this.example = '';
  }
}
