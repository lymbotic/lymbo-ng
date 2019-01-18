import {CardType} from './card-type.enum';
import {Aspect} from './aspect.interface';
import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';
import {Side} from './side/side.model';

/**
 * Represents a card
 */
export class Card extends Entity {

  /** Type */
  type: CardType;
  /** References to tags */
  tagIds: string[];

  /** Aspects */
  aspects: Aspect[];

  /** Favorite */
  favorite: boolean;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.type = CardType.UNSPECIFIED;
    this.tagIds = [];
    this.favorite = false;
    this.aspects = [];
  }
}
