import {Injectable} from '@angular/core';
import {Tag} from '../model/tag.model';
import {Stack} from '../model/stack/stack.model';
import {Card} from '../model/card/card.model';
import {Language} from '../model/card/language.enum';
import {Tense} from '../model/card/tense/tense.enum';
import {TenseGroup} from '../model/card/tense/tense-group';
import {Answer} from '../model/card/quiz/answer.model';
import {Vocabel} from '../model/card/example/vocabel.model';

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
   * Clones a given tense
   * @param {Language} original
   * @returns {Language} cloned object
   */
  static cloneLanguage(original: Language): Language {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tenses
   * @param {Tense[]} original
   * @returns {Tense[]} cloned object
   */
  static cloneTenses(original: Tense[]): Tense[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tenseGroups
   * @param {TenseGroup[]} original
   * @returns {TenseGroup[]} cloned object
   */
  static cloneTenseGroups(original: TenseGroup[]): TenseGroup[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of answerGroups
   * @param {Answer[]} original
   * @returns {Answer[]} cloned object
   */
  static cloneAnswers(original: Answer[]): Answer[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given vocabel
   * @param {Vocabel} original
   * @returns {Vocabel} cloned object
   */
  static cloneVocabel(original: Vocabel): Vocabel {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of vocabels
   * @param {Vocabel} original
   * @returns {Vocabel} cloned object
   */
  static cloneVocabels(original: Vocabel[]): Vocabel[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
