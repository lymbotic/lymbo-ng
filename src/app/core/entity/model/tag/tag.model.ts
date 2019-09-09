import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a tag which can be used to label other entities
 */
export class Tag extends Entity {

  /** Name */
  name: string;
  /** Whether tags is checked in filter mechanism */
  checked = false;

  /**
   * Constructor
   * @param name tag name
   * @param checked whether tags is checked in filter mechanism
   */
  constructor(name: string, checked = false) {
    super();
    this.entityType = EntityType.TAG;
    this.name = name.trim();
    this.checked = checked;
  }
}
