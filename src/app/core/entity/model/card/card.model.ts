import {CardType} from './card-type.enum';
import {Aspect} from './aspect.interface';
import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

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

  /** Box this card is in */
  box: number;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.CARD;
    this.type = CardType.UNSPECIFIED;
    this.tagIds = [];
    this.aspects = [];
    this.favorite = false;
    this.box = 0;
  }
}
