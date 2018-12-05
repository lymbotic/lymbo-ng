import {Card} from './card.model';
import {Tag} from './tag.model';
import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';

/**
 * Represents a stack
 */
export class Stack extends Entity {

  /** Title */
  title: string;
  /** Image URL */
  imageUrl: string;
  /** Cards */
  cards: Card[];
  /** References to tags */
  tagIds: string[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.title = '';
    this.cards = [];
    this.tagIds = [];
  }
}
