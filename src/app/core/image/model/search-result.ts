import {Photo} from './photo.model';

/**
 * Represents a search result
 */
export class SearchResult {

  /** Total result */
    // tslint:disable-next-line:variable-name
  total_results: number;
  /** Page */
  page: number;
  /** Results per page */
    // tslint:disable-next-line:variable-name
  per_page: number;
  /** Photos */
  photos: Photo[];
}
