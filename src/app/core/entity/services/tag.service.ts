import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/index';
import {Tag} from '../model/tag.model';
import {EntityType} from '../model/entity-type.enum';
import {environment} from '../../../../environments/environment';
import {PouchDBService} from '../../persistence/services/pouchdb.service';
import {SnackbarService} from '../../ui/services/snackbar.service';
import {SuggestionService} from './suggestion.service';
import {Card} from '../model/card/card.model';

/**
 * Handles tags including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */
@Injectable({
  providedIn: 'root'
})
export class TagService {

  /** Map of all tags */
  tags = new Map<string, Tag>();
  /** Subject that can be subscribed by components that are interested in changes */
  tagsSubject = new Subject<Tag[]>();

  /**
   * Constructor
   * @param {PouchDBService} pouchDBService
   * @param {SnackbarService} snackbarService
   * @param {SuggestionService} suggestionService
   */
  constructor(private pouchDBService: PouchDBService,
              private snackbarService: SnackbarService,
              private suggestionService: SuggestionService) {
    this.initializeTagSubscription();
    this.findTags();
  }

  //
  // Initialization
  //

  // <editor-fold desc="Initialization">

  /**
   * Initializes tag subscription
   */
  private initializeTagSubscription() {
    this.tagsSubject.subscribe((value) => {
      (value as Tag[]).forEach(tag => {
          this.tags.set(tag.id, tag);
        }
      );

      this.suggestionService.updateByTags(Array.from(this.tags.values()));
    });
  }

  // </editor-fold>

  //
  // Queries
  //

  // <editor-fold desc="Queries">

  /**
   * Loads tags
   */
  public findTags() {
    const index = {fields: ['entityType', 'scope', 'creationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.TAG}},
          {creationDate: {$gt: null}}
        ]
      },
      // sort: [{'creationDate': 'desc'}],
      limit: environment.LIMIT_TAGS
    };

    this.clearTags();
    this.findTagsInternal(index, options);
  }

  /**
   * Clears tags
   */
  private clearTags() {
    this.tags.clear();
  }

  /**
   * Index tags and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findTagsInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const tag = element as Tag;
          this.tags.set(tag.id, tag);
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }


  /**
   * Aggregates all tag IDs of a list of given cards
   * @param cards cards
   */
  private getTagIdsByCards(cards: Card[]): string[] {
    const tagIds = new Map<string, string>();

    cards.forEach(card => {
      card.tagIds.forEach(tagId => {
        tagIds.set(tagId, tagId);
      });
    });

    return Array.from(tagIds.values());
  }

  // </editor-fold>

  //
  // Persistence
  //

  // <editor-fold desc="Persistence">

  /**
   * Creats a new tag
   * @param {Tag} tag tag to be created
   */
  public createTag(tag: Tag): Promise<any> {
    return new Promise((resolve) => {
      if (tag != null) {
        // Remove transient attributes
        tag.checked = undefined;

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          this.snackbarService.showSnackbar('Added tag');
          this.tags.set(tag.id, tag);
          this.notify();
          resolve();
        });
      }
    });
  }

  /**
   * Updates existing tag
   * @param {Tag} tag tag to be updated
   * @param {boolean} showSnack shows snackbar if true
   */
  public updateTag(tag: Tag, showSnack = false): Promise<any> {
    return new Promise((resolve) => {
      if (tag != null) {
        // Remove transient attributes
        tag.checked = undefined;

        tag.modificationDate = new Date();

        return this.pouchDBService.upsert(tag.id, tag).then(() => {
          if (showSnack) {
            this.snackbarService.showSnackbar('Updated tag');
          }
          this.tags.set(tag.id, tag);
          this.notify();
          resolve();
        });
      }
    });
  }

  /**
   * Deletes a tag
   * @param {Tag} tag tag to be deleted
   */
  public deleteTag(tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tag == null) {
        reject();
      }

      return this.pouchDBService.remove(tag.id, tag).then(() => {
        this.snackbarService.showSnackbar('Deleted tag');
        this.tags.delete(tag.id);
        this.notify();
        resolve();
      });
    });
  }

  // </editor-fold>

  //
  // Lookup
  //

  // <editor-fold desc="Lookup">

  /**
   * Retrieves a tag by a given ID
   * @param {string} id ID to find tag by
   * @returns {Tag} tag identified by given ID, null if no such tag exists
   */
  public getTagById(id: string): Tag {
    return this.tags.get(id);
  }

  /**
   * Retrieves a tag by a given name
   * @param {string} name name to find tag by
   * @returns {Tag} tag identified by given name, null if no such tag exists
   */
  public getTagByName(name: string): Tag {
    let tag: Tag = null;

    Array.from(this.tags.values()).forEach(t => {
      if (t.name === name) {
        tag = t;
      }
    });

    return tag;
  }

  // </editor-fold>

  //
  // Notification
  //

  // <editor-fold desc="Notification">

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.tagsSubject.next(Array.from(this.tags.values()).sort((t1, t2) => {
      return t2.name < t1.name ? 1 : -1;
    }).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  // </editor-fold>
}
