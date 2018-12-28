import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {Stack} from '../model/stack.model';
import {Card} from '../model/card.model';
import {Language} from '../model/language.enum';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root'
})
export class CloneService {

  /**
   * Clones a given stack
   * @param {Stack} original
   * @returns {Stack} cloned object
   */
  static cloneStack(original: Stack): Stack {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given card
   * @param {Card} original
   * @returns {Card} cloned object
   */
  static cloneCard(original: Card): Card {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of cards
   * @param {Card[]} original
   * @returns {Card[]} cloned object
   */
  static cloneCards(original: Card[]): Card[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tag
   * @param {Tag} original
   * @returns {Tag} cloned object
   */
  static cloneTag(original: Tag): Tag {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tags
   * @param {Tag[]} original
   * @returns {Tag[]} cloned object
   */
  static cloneTags(original: Tag[]): Tag[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given language
   * @param {Language} original
   * @returns {Language} cloned object
   */
  static cloneLanguage(original: Language): Language {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
