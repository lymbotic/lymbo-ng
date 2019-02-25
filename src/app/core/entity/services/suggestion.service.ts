import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../model/tag/tag.model';
import {Stack} from '../model/stack/stack.model';
import {Card} from '../model/card/card.model';
import {AspectType} from '../model/card/aspect.type';
import {SideAspect} from '../model/card/side/side-aspect';

/**
 * Service handling suggestions
 */
@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  /** Map of search items, key is creation date, value is actual value */
  searchOptions: Map<string, string>;
  /** Counter used to differentiate between search options with the same timestamp */
  searchOptionsCounter = 0;

  /** Map of tag options */
  tagOptions: Map<string, Tag>;

  /** Subject that publishes search options */
  searchOptionsSubject = new Subject<string[]>();

  /**
   * Constructor
   */
  constructor() {
    this.searchOptions = new Map<string, string>();
    this.tagOptions = new Map<string, Tag>();
  }

  //
  // Updates
  //

  /**
   * Adds cards information to suggestions
   * @param {Stack[]} stacks new array of cards
   */
  public updateByStacks(stacks: Stack[]) {
    stacks.sort((s1, s2) => {
      return (new Date(s1.modificationDate) < new Date(s2.modificationDate)) ? 1 : -1;
    }).forEach(s => {
      if (s != null) {
        // Add title to search items
        if (s.title != null && s.creationDate) {
          const value = s.title.trim();
          this.searchOptions.set(s.creationDate.toString() + this.searchOptionsCounter++, value);
        }
      }
    });

    this.notify();
  }

  /**
   * Adds cards information to suggestions
   * @param {Card[]} cards new array of cards
   */
  public updateByCards(cards: Card[]) {
    cards.sort((cardA: Card, cardB: Card) => {
      return new Date(cardA.modificationDate).getTime() - new Date(cardB.modificationDate).getTime();
    }).forEach(c => {
      const sideAspect = c.aspects.filter(aspect => {
        return aspect.type === AspectType.SIDE;
      })[0] as SideAspect;

      if (c != null && sideAspect != null) {
        sideAspect.sides.forEach(s => {
          // Add title to search items
          if (s.title != null && c.creationDate) {
            const value = s.title.trim();
            this.searchOptions.set(c.creationDate.toString() + this.searchOptionsCounter++, value);
          }
        });
      }
    });

    this.notify();
  }

  /**
   * Add tags information to suggestions
   * @param {Tag[]} tags new array of tags
   */
  public updateByTags(tags: Tag[]) {
    tags.forEach(t => {
      if (t != null) {
        // Add person name to search options
        if (t.name) {
          const value = t.name.trim();
          this.tagOptions.set(value, t);
        }
      }
    });

    this.notify();
  }

  //
  // Notification
  //

  /**
   * Notifies subscribers that something has changed
   */
  private notify() {
    this.searchOptions = new Map(Array.from(this.searchOptions).sort());

    // Turns search options map into an array
    const searchOptionsArrayReversed = new Set(Array.from(this.searchOptions.values()).reverse());
    // Unreverse first array (reverse is necessary to have later appearances of tags at the beginning)
    const searchOptionsArrayUnreversed = Array.from(searchOptionsArrayReversed).reverse();

    this.searchOptionsSubject.next(searchOptionsArrayUnreversed);
  }
}
