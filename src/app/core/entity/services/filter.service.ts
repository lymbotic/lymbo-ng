import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {CloneService} from './clone.service';
import {Subject} from 'rxjs';
import {TagService} from './tag.service';

/**
 * Handles filter values
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  /** Current search item */
  searchItem;

  /** Map of tags */
  tags: Map<string, Tag>;
  /** Indicates whether a filter for favorite cards is active */
  favorites = false;

  /** Subject publishing filter subjects */
  filterSubject = new Subject();
  /** Helper subject used to finish other subscriptions */
  unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param {CloneService} cloneService
   * @param {TagService} tagService
   */
  constructor(private cloneService: CloneService,
              private tagService: TagService) {
    this.clearAllFilters();
  }

  //
  // Search item
  //

  /**
   * Clears the search item and notifies subscribers
   */
  public clearSearchItem() {
    this.searchItem = '';
    this.notify();
  }

  /**
   * Updates search item and notifies subscribers
   * @param {string} searchItem new search item
   */
  public updateSearchItem(searchItem: string) {
    this.searchItem = searchItem;
    this.notify();
  }

  //
  // Tags
  //

  /**
   * Clears tags
   */
  public clearTags() {
    this.tags = new Map<string, Tag>();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags arry of tags
   */
  public updateTagsList(tags: Tag[]) {
    this.updateTagsListInternal(tags);
    this.notify();
  }

  /**
   * Updates tags and notifies subscribers
   * @param {Tag[]} tags array of tags
   */
  public updateTagsListIfNotEmpty(tags: Tag[]) {
    if (this.tags.size > 0) {
      this.updateTagsList(tags);
    }
  }

  /**
   * Updates tags
   * @param {Tag[]} tags array of tags
   */
  private updateTagsListInternal(tags: Tag[]) {
    if (tags != null) {
      tags.forEach((t: Tag) => {
        const tag = CloneService.cloneTag(t);

        this.tags.set(tag.id, tag);
      });
    }
  }

  //
  // Favorites
  //

  /**
   * Clears favorite
   */
  public clearFavorites() {
    this.favorites = false;
  }

  /**
   * Updates favorites flag and notifies subscribers
   * @param {boolean} favorites favorites flag
   */
  public updateFavorites(favorites: boolean): Promise<any> {
    return new Promise((resolve) => {
      this.favorites = favorites;
      this.notify();
      resolve();
    });
  }

  //
  // Clear
  //

  /**
   * Clears all currently set filters
   */
  public clearAllFilters(): Promise<any> {
    return new Promise((resolve) => {
      this.clearSearchItem();
      this.clearFavorites();
      this.clearTags();
      this.notify();
      resolve();
    });
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.filterSubject.next();
  }
}
