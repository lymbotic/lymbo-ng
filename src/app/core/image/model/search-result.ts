import {Photo} from './photo.model';

/**
 * Represents a search result
 */
export class SearchResult {

  /** Total result */
  total_results: number;
  /** Page */
  page: number;
  /** Results per page */
  per_page: number;
  /** Photos */
  photos: Photo[];
}
