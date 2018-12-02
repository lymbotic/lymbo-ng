import {EntityType} from './entity-type.enum';

/**
 * Represents a side
 */
export class Side {

  /** Title */
  title: string;
  /** Image URL */
  imageUrl: string;

  /**
   * Constructor
   * @param title title
   * @param imageUrl image URL
   */
  constructor(title?: string, imageUrl?: string) {
    this.title = title != null ? title : '';
    this.imageUrl = imageUrl;
  }
}
