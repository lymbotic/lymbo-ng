import {Card} from './card.model';
import {Entity} from './entity.model';
import {EntityType} from './entity-type.enum';
import {StackType} from './stack-type.enum';
import {Language} from './language.enum';

/**
 * Represents a stack
 */
export class Stack extends Entity {

  /** Type */
  type: StackType;
  /** Title */
  title: string;
  /** Image URL */
  imageUrl: string;
  /** Cards */
  cards: Card[];
  /** References to tags */
  tagIds: string[];

  // Language

  /** Source language */
  sourceLanguage: Language;
  /** Target language */
  targetLanguage: Language;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.type = StackType.UNSPECIFIED;
    this.title = '';
    this.cards = [];
    this.tagIds = [];

    this.sourceLanguage = Language.UNSPECIFIED;
    this.targetLanguage = Language.UNSPECIFIED;
  }
}
