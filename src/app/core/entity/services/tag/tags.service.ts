import {Injectable} from '@angular/core';
import {Tag} from '../../model/tag/tag.model';
import {Card} from '../../model/card/card.model';
import {SuggestionService} from '../suggestion.service';
import {Stack} from '../../model/stack/stack.model';

/**
 * Handles tags including
 * <li> Queries
 * <li> Persistence
 * <li> Lookup
 */
@Injectable({
  providedIn: 'root'
})
export class TagsService {

  /** Map of all tags */
  tags = new Map<string, Tag>();

  //
  // Sort
  //

  /**
   * Sorts tags based on their modification date
   * @param tagA first tag
   * @param tagB seconds tag
   */
  static sortTags(tagA: Tag, tagB: Tag) {
    return (new Date(tagB.modificationDate) < new Date(tagA.modificationDate)) ? -1 : 1;
  }

  /**
   * Constructor
   * @param suggestionService suggestion service
   */
  constructor(private suggestionService: SuggestionService) {
  }

  //
  // Persistence
  //

  /**
   * Creates a new tag and adds a to a stack
   * @param stack stack to add tag to
   * @param tag tag to be created
   */
  public createTag(stack: Stack, tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tag == null) {
        reject();
      }

      stack.tags.push(tag);
      resolve();
    });
  }

  /**
   * Updates an existing tag
   * @param stack stack
   * @param tag tag to be updated
   */
  public updateTag(stack: Stack, tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tag == null) {
        reject();
      }

      // Set modification date
      tag.modificationDate = new Date();

      this.updateTagOfStack(stack, tag);
      resolve();
    });
  }

  /**
   * Deletes a tag
   * @param stack stack
   * @param tag tag to be deleted
   */
  public deleteTag(stack: Stack, tag: Tag): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tag == null) {
        reject();
      }

      this.removeTagFromStack(stack, tag);
      resolve();
    });
  }

  //
  //
  //

  /**
   * Updates tag of stack
   * @param stack stack
   * @param tag tag
   */
  private updateTagOfStack(stack: Stack, tag: Tag) {
    // Get index of the tag to be updated
    const index = stack.tags.findIndex(c => {
      return c.id === tag.id;
    });

    // Update the tag
    stack.tags[index] = tag;
  }

  /**
   * Removes tag from stack
   * @param stack stack
   * @param tag tag
   */
  private removeTagFromStack(stack: Stack, tag: Tag) {
    // Filter out the tag
    stack.tags = stack.tags.filter(c => {
      return c.id !== tag.id;
    });
  }

  //
  // Queries
  //

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

  //
  // Lookup
  //

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
}
