import {Injectable} from '@angular/core';
import {Tag} from '../model/tag/tag.model';
import {Stack} from '../model/stack/stack.model';
import {Card} from '../model/card/card.model';
import {Language} from '../model/card/language.enum';
import {Tense} from '../model/card/tense/tense.enum';
import {TenseGroup} from '../model/card/tense/tense-group';
import {Answer} from '../model/card/quiz/answer.model';
import {Vocabel} from '../model/card/example/vocabel.model';
import {User} from 'firebase';

/**
 * Creates deep copies of objects
 */
@Injectable({
  providedIn: 'root'
})
export class CloneService {

  /**
   * Clones a given user
   * @param original original
   * @returns clone cloned object
   */
  static cloneUser(original: User): User {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given stack
   * @param original original
   * @returns clone cloned object
   */
  static cloneStack(original: Stack): Stack {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of stacks
   * @param original original
   * @returns clone cloned object
   */
  static cloneStacks(original: Stack[]): Stack[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given card
   * @param original original
   * @returns clone cloned object
   */
  static cloneCard(original: Card): Card {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of cards
   * @param original original
   * @returns clone cloned object
   */
  static cloneCards(original: Card[]): Card[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tag
   * @param original original
   * @returns clone cloned object
   */
  static cloneTag(original: Tag): Tag {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tags
   * @param original original
   * @returns clone cloned object
   */
  static cloneTags(original: Tag[]): Tag[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given tense
   * @param original original
   * @returns clone cloned object
   */
  static cloneLanguage(original: Language): Language {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tenses
   * @param original original
   * @returns clone cloned object
   */
  static cloneTenses(original: Tense[]): Tense[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of tenseGroups
   * @param original original
   * @returns clone cloned object
   */
  static cloneTenseGroups(original: TenseGroup[]): TenseGroup[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of answerGroups
   * @param original original
   * @returns clone cloned object
   */
  static cloneAnswers(original: Answer[]): Answer[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given vocabel
   * @param original original
   * @returns clone cloned object
   */
  static cloneVocabel(original: Vocabel): Vocabel {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }

  /**
   * Clones a given array of vocabels
   * @param original original
   * @returns clone cloned object
   */
  static cloneVocabels(original: Vocabel[]): Vocabel[] {
    return original != null ? JSON.parse(JSON.stringify(original)) : null;
  }
}
