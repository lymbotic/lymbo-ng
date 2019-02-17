import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';
import {StackType} from './stack-type.enum';
import {Card} from '../card/card.model';
import {Language} from '../card/language.enum';
import {VibrantPalette} from '../vibrant-palette';
import {Tag} from '../tag/tag.model';

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
  /** Image palette */
  imagePalette: VibrantPalette;
  /** Cards */
  cards: Card[];
  /** Tags */
  tags: Tag[];
  /** References to tags */
  tagIds: string[];

  // Language

  /** Source tense */
  sourceLanguage: Language;
  /** Target tense */
  targetLanguage: Language;
  /** Verb tenses */
  tenses: string[];

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.STACK;
    this.type = StackType.UNSPECIFIED;
    this.title = '';
    this.cards = [];
    this.tags = [];
    this.tagIds = [];

    this.sourceLanguage = Language.UNSPECIFIED;
    this.targetLanguage = Language.UNSPECIFIED;
    this.tenses = [];
  }
}
