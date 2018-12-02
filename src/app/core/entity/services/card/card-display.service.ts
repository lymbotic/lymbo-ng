import {Injectable} from '@angular/core';
import {Card} from '../../model/card.model';

/**
 * Enum representing display aspects
 */
export enum DisplayAspect {
  CAN_BE_CREATED,
  CAN_BE_UPDATED,
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
    return card != null
      && card.sides != null
      && card.sides.length > 0
      && card.sides[0].title != null && card.sides[0].title.length > 0
      && card.sides[1].title != null && card.sides[1].title.length > 0;
  }

  /**
   * Determines whether a given card can be updated
   * @param card card
   */
  static canBeUpdated(card: Card): boolean {
    return card != null
      && card.sides != null
      && card.sides.length > 0
      && card.sides[0].title != null && card.sides[0].title.length > 0
      && card.sides[1].title != null && card.sides[1].title.length > 0;
  }
}
