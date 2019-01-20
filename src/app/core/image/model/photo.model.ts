import {Source} from './source.model';

/**
 * Represents a photo
 */
export class Photo {

  /** ID */
  id: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** URL */
  url: string;
  /** Photographer */
  photographer: string;
  /** Photographer URL */
  photographer_url: string;
  /** Source */
  src: Source;
}
