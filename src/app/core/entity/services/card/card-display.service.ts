import {Injectable} from '@angular/core';
import {Card} from '../../model/card/card.model';
import {CardType} from '../../model/card/card-type.enum';
import {AspectType} from '../../model/card/aspect.type';
import {SideAspect} from '../../model/card/side/side-aspect';
import {QuizAspect} from '../../model/card/quiz/quiz-aspect.model';

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
    return card !== null && CardDisplayService.isComplete(card);
  }

  /**
   * Deteermines if a card is complete
   * @param card card
   */
  static isComplete(card: Card) {
    switch (card.type) {
      case CardType.FREESTYLE: {
        const sideAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.SIDE;
        })[0] as SideAspect;

        return sideAspect !== null
          && sideAspect.sides !== null
          && sideAspect.sides.length > 0
          && sideAspect.sides[0].title !== null && sideAspect.sides[0].title.length > 0
          && sideAspect.sides[1].title !== null && sideAspect.sides[1].title.length > 0;
      }
      case CardType.VOCABULARY: {
        const sideAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.SIDE;
        })[0] as SideAspect;

        return sideAspect != null
          && sideAspect.sides !== null
          && sideAspect.sides.length > 0
          && sideAspect.sides[0].title != null
          && sideAspect.sides[0].title.length > 0;
      }
      case CardType.QUIZ: {
        const quizAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.QUIZ;
        })[0] as QuizAspect;

        return quizAspect != null
          && quizAspect.question !== null
          && quizAspect.question !== ''
          && quizAspect.answers != null
          && quizAspect.answers.some(answer => {
            return answer.selected;
          });
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
