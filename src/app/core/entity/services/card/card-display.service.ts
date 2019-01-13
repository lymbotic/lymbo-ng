import {Injectable} from '@angular/core';
import {Card} from '../../model/card.model';
import {CardType} from '../../model/card-type.enum';

/**
 * Enum representing display aspects
 */
export enum DisplayAspect {
  CAN_BE_CREATED,
  CAN_BE_UPDATED,

  TITLES,
  VOCABULARY,
  QUIZ
}

/**
 * Handles card display options
 */
@Injectable({
  providedIn: 'root'
})
export class CardDisplayService {

  //
  // Helpers
  //

  /**
   * Determines whether a given card can be created
   * @param card card
   */
  static canBeCreated(card: Card): boolean {
    return card != null && CardDisplayService.isComplete(card);
  }

  /**
   * Determines whether a given card can be updated
   * @param card card
   */
  static canBeUpdated(card: Card): boolean {
    return card != null && CardDisplayService.isComplete(card);
  }

  static isComplete(card: Card) {
    switch (card.type) {
      case CardType.FREESTYLE: {
        return card.sides != null
          && card.sides.length > 0
          && card.sides[0].title != null && card.sides[0].title.length > 0
          && card.sides[1].title != null && card.sides[1].title.length > 0;
      }
      case CardType.VOCABULARY: {
        return card.sides != null
          && card.sides.length > 0
          && card.sides[0].title != null && card.sides[0].title.length > 0
          && card.sides[1].title != null && card.sides[1].title.length > 0;
      }
      case CardType.QUIZ: {
        return card.question != null && card.question !== '';
      }
      default: {
        return false;
      }
    }
  }

  /**
   * Determines whether a given card contains titles
   * @param card card
   */
  static containsTitles(card: Card): boolean {
    return card != null
      && (card.type === CardType.FREESTYLE
        || card.type === CardType.VOCABULARY);
  }

  /**
   * Determines whether a given card contains vocabulary
   * @param card card
   */
  static containsVocabulary(card: Card): boolean {
    return card != null
      && card.type === CardType.VOCABULARY;
  }

  /**
   * Determines whether a given card contains a quiz
   * @param card card
   */
  static containsQuiz(card: Card): boolean {
    return card != null
      && card.type === CardType.QUIZ;
  }
}
