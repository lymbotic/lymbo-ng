import {Injectable} from '@angular/core';
import {SettingsService} from '../../../settings/services/settings.service';
import {CardType} from '../../model/card/card-type.enum';
import {CardTypeGroup} from '../../model/card/card-type-group.enum';

/**
 * Handles card type hierarchy
 */
@Injectable({
  providedIn: 'root'
})
export class CardTypeService {

  /** Map of card types and type groups */
  cardTypeGroups = new Map<CardType, CardTypeGroup>();

  /**
   * Constructor
   * @param settingsService settings service
   */
  constructor(private settingsService: SettingsService) {
    this.initializeCardTypeHierarchy();
  }

  //
  // Initialization
  //

  /**
   * Initializes card type hierarchy
   */
  private initializeCardTypeHierarchy() {
    const groups = Object.keys(CardTypeGroup).map(key => CardTypeGroup[key]);

    groups.forEach(group => {
      switch (group) {
        case CardTypeGroup.UNSPECIFIED: {
          this.cardTypeGroups.set(CardType.UNSPECIFIED, group);
          break;
        }
        case CardTypeGroup.FREESTYLE: {
          this.cardTypeGroups.set(CardType.FREESTYLE, group);
          break;
        }
        case CardTypeGroup.VOCABULARY: {
          this.cardTypeGroups.set(CardType.VOCABULARY, group);
          break;
        }
        case CardTypeGroup.INFORMATION: {
          this.cardTypeGroups.set(CardType.INFORMATION, group);
          break;
        }
        case CardTypeGroup.QUIZ: {
          this.cardTypeGroups.set(CardType.QUIZ, group);
          break;
        }
      }
    });
  }

  //
  // Lookup
  //

  /**
   * Returns a list of card types contained in a given card type group
   * @param group card type group
   */
  public getCardTypesByGroup(group: CardTypeGroup): CardType[] {
    const types: CardType[] = [];

    this.cardTypeGroups.forEach((g: CardTypeGroup, t: CardType) => {
      if (g === group) {
        types.push(t);
      }
    });

    return types;
  }

  /**
   * Returns the card type group of a given card type
   * @param type card type
   */
  public getCardGroupByType(type: CardType): CardTypeGroup {
    return this.cardTypeGroups.get(type);
  }

  /**
   * Determines if a card type group contains a given card type
   * @param group card type group
   * @param type card type
   */
  public groupContainsType(group: CardTypeGroup, type: CardType) {
    return this.cardTypeGroups.get(type) === group;
  }

  /**
   * Retrieves an icon by card type
   * @param group card type group
   */
  public getIconByCardTypeGroup(group: CardTypeGroup): string {
    switch (group) {
      case CardTypeGroup.UNSPECIFIED: {
        return 'help';
      }
      case CardTypeGroup.FREESTYLE: {
        return 'crop_free';
      }
      case CardTypeGroup.VOCABULARY: {
        return 'chat_bubble_outline';
      }
      case CardTypeGroup.INFORMATION: {
        return 'school';
      }
      case CardTypeGroup.QUIZ: {
        return 'question_answer';
      }
    }
  }

  /**
   * Retrieves an icon by card type
   * @param type card type
   */
  public getIconByCardType(type: CardType): string {
    switch (type) {
      case CardType.UNSPECIFIED: {
        return 'help';
      }
      case CardType.FREESTYLE: {
        return 'crop_free';
      }
      case CardType.VOCABULARY: {
        return 'chat_bubble_outline';
      }
      case CardType.INFORMATION: {
        return 'school';
      }
      case CardType.QUIZ: {
        return 'question_answer';
      }
    }
  }
}
