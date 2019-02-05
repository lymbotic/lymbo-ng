import {Injectable} from '@angular/core';
import {Card} from '../../model/card/card.model';
import {CardType} from '../../model/card/card-type.enum';
import {AspectType} from '../../model/card/aspect.type';
import {SideAspect} from '../../model/card/side/side-aspect';
import {QuizAspect} from '../../model/card/quiz/quiz-aspect.model';
import {InformationAspect} from '../../model/card/information/information-aspect.model';

/**
 * Enum representing display aspects
 */
export enum DisplayAspect {
  CAN_BE_CREATED,
  CAN_BE_UPDATED,

  TITLES,
  TENSES,
  EXAMPLES,
  INFORMATION,
  SINGLE_CHOICE_QUIZ,
  MULTIPLE_CHOICE_QUIZ
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
   * Determines if a card is complete
   * @param card card
   */
  static isComplete(card: Card) {
    switch (card.type) {
      case CardType.FREESTYLE:
      case CardType.TENSES:
      case CardType.EXAMPLES: {
        const sideAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.SIDE;
        })[0] as SideAspect;

        return sideAspect !== null
          && sideAspect.sides !== null
          && sideAspect.sides.length > 0
          && sideAspect.sides[0].title !== null && sideAspect.sides[0].title.length > 0
          && sideAspect.sides[1].title !== null && sideAspect.sides[1].title.length > 0;
      }
      case CardType.INFORMATION: {
        const informationAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.INFORMATION;
        })[0] as InformationAspect;

        return informationAspect != null
          && informationAspect.text != null
          && informationAspect.text.trim() != null
          && informationAspect.text.trim() !== '';
      }
      case CardType.SINGLE_CHOICE_QUIZ: {
        const quizAspect = card.aspects.filter(aspect => {
          return aspect.type === AspectType.QUIZ;
        })[0] as QuizAspect;

        return quizAspect != null
          && quizAspect.question !== null
          && quizAspect.question !== ''
          && quizAspect.answers != null
          && quizAspect.answers.filter(answer => {
            return answer.selected;
          }).length === 1;
      }
      case CardType.MULTIPLE_CHOICE_QUIZ: {
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
        || card.type === CardType.TENSES
        || card.type === CardType.EXAMPLES);
  }

  /**
   * Determines whether a given card contains tenses
   * @param card card
   */
  static containsTenses(card: Card): boolean {
    return card != null
      && card.type === CardType.TENSES;
  }

  /**
   * Determines whether a given card contains examples
   * @param card card
   */
  static containsExamples(card: Card): boolean {
    return card != null
      && card.type === CardType.EXAMPLES;
  }

  /**
   * Determines whether a given card contains information aspect
   * @param card card
   */
  static containsInformation(card: Card): boolean {
    return card != null
      && card.type === CardType.INFORMATION;
  }

  /**
   * Determines whether a given card contains a single choice quiz
   * @param card card
   */
  static containsSingleChoiceQuiz(card: Card): boolean {
    return card != null
      && card.type === CardType.SINGLE_CHOICE_QUIZ;
  }

  /**
   * Determines whether a given card contains a multiple choice quiz
   * @param card card
   */
  static containsMultipleChoiceQuiz(card: Card): boolean {
    return card != null
      && card.type === CardType.MULTIPLE_CHOICE_QUIZ;
  }
}
