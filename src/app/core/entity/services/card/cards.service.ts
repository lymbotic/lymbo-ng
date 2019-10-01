import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Stack} from '../../model/stack/stack.model';
import {CardDisplayService, DisplayAspect} from './card-display.service';
import {CardTypeService} from './card-type.service';
import {Card} from '../../model/card/card.model';
import {CardTypeGroup} from '../../model/card/card-type-group.enum';
import {CardType} from '../../model/card/card-type.enum';
import {Tag} from '../../model/tag/tag.model';
import {TagsService} from '../tag/tags.service';
import {LogService} from '../../../log/services/log.service';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class CardsService {

  /** Map of all cards */
  cards = new Map<string, Card>();
  /** Subject that publishes cards */
  cardsSubject = new Subject<Card[]>();

  /** Whether all cards are flipped */
  viceVersa = false;

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given cardlet contains a display aspect
   * @param displayAspect display aspect
   * @param card card
   */
  static containsDisplayAspect(displayAspect: DisplayAspect, card: Card): boolean {
    switch (displayAspect) {
      case DisplayAspect.CAN_BE_CREATED: {
        return CardDisplayService.canBeCreated(card);
      }
      case DisplayAspect.CAN_BE_UPDATED: {
        return CardDisplayService.canBeUpdated(card);
      }
      case DisplayAspect.TITLES: {
        return CardDisplayService.containsTitles(card);
      }
      case DisplayAspect.TENSES: {
        return CardDisplayService.containsTenses(card);
      }
      case DisplayAspect.EXAMPLES: {
        return CardDisplayService.containsExamples(card);
      }
      case DisplayAspect.INFORMATION: {
        return CardDisplayService.containsInformation(card);
      }
      case DisplayAspect.SINGLE_CHOICE_QUIZ: {
        return CardDisplayService.containsSingleChoiceQuiz(card);
      }
      case DisplayAspect.MULTIPLE_CHOICE_QUIZ: {
        return CardDisplayService.containsMultipleChoiceQuiz(card);
      }
    }
  }

  //
  // Sort
  //

  /**
   * Sorts cards based on their modification date
   * @param cardA first card
   * @param cardB seconds card
   */
  static sortCards(cardA: Card, cardB: Card) {
    if (!isNaN(cardA.index) && !isNaN(cardB.index)) {
      return (cardA.index > cardB.index) ? -1 : 1;
    } else {
      return 0;
    }
  }

  /**
   * Shuffles cards
   * @param cards cards
   */
  static shuffleCards(cards: Card[]): Card[] {
    let currentIndex = cards.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }

    return cards;
  }

  //
  // Lookup
  //

  /**
   * Get minimum index of a given list of cards
   * @param cards cards
   */
  static getMinIndex(cards: Card[]): number {
    const min = Math.min(...cards.map(card => {
      return card.index;
    }).filter(index => {
      return !isNaN(index);
    }));

    return !isNaN(min) ? min : 0;
  }

  /**
   * Get maximum index of a given list of cards
   * @param cards cards
   */
  static getMaxIndex(cards: Card[]): number {
    const max = Math.max(...cards.map(card => {
      return card.index;
    }).filter(index => {
      return !isNaN(index);
    }));

    return !isNaN(max) ? max : 0;
  }

  /**
   * Constructor
   * @param cardTypeService card type service
   * @param tagsService tag service
   */
  constructor(private cardTypeService: CardTypeService,
              private tagsService: TagsService) {
  }

  //
  // Initialization
  //

  /**
   * Initializes cards
   * @param cards cards
   */
  public initializeCards(cards: Card[]) {
    this.clearCards();
    cards.forEach(card => {
      this.cards.set(card.id, card);
    });
    this.notify();
  }

  /**
   * Clears cards
   */
  public clearCards() {
    this.cards.clear();
    this.notify();
  }

  //
  // Persistence
  //

  /**
   * Creates a new card
   * @param stack stack
   * @param card card to be created
   */
  public createCard(stack: Stack, card: Card): Promise<any> {
    LogService.trace(`CardsService#createCard`);
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      card.index = CardsService.getMaxIndex(Array.from(this.cards.values())) + 1;

      stack.cards.push(card);
      resolve();
    });
  }

  /**
   * Updates an existing card
   * @param stack stack
   * @param card card to be updated
   */
  public updateCard(stack: Stack, card: Card): Promise<any> {
    LogService.trace(`CardsService#updateCard`);
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      // Set modification date
      card.modificationDate = new Date();

      this.updateCardOfStack(stack, card);
      resolve();
    });
  }

  /**
   * Deletes a card
   * @param card card to be deleted
   * @param stack stack
   */
  public deleteCard(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }
      this.removeCardFromStack(stack, card);
      resolve();
    });
  }

  //
  //
  //

  /**
   * Updates related tags
   * @param stack stack
   * @param card card
   */
  public updateRelatedTags(stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.tagIds.forEach(id => {
        const tag = this.tagsService.getTagById(id);
        this.tagsService.updateTag(stack, tag).then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Updates card of stack
   * @param stack stack
   * @param card card
   */
  private updateCardOfStack(stack: Stack, card: Card) {
    // Get index of the card to be updated
    const index = stack.cards.findIndex(c => {
      return c.id === card.id;
    });

    // Update the card
    stack.cards[index] = card;
  }

  /**
   * Removes card from stack
   * @param stack stack
   * @param card card
   */
  private removeCardFromStack(stack: Stack, card: Card) {
    // Filter out the card
    stack.cards = stack.cards.filter(c => {
      return c.id !== card.id;
    });
  }

  //
  // State
  //

  /**
   * Puts card a the end of a stack
   * @param stack stack
   * @param card card
   */
  public putCardToEnd(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.index = CardsService.getMinIndex(Array.from(this.cards.values())) - 1;
      this.updateCard(stack, card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Moves card to next stack
   * @param stack stack
   * @param card card
   */
  public moveCardToNextBox(stack: Stack, card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.box != null ? card.box++ : card.box = 1;
      this.updateCard(stack, card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Moves all cards to the first box
   * @param stack stack
   */
  public moveAllCardsToFirstBox(stack) {
    return new Promise((resolve) => {
      stack.cards.forEach(card => {
        card.box = 0;
      });

      resolve();
    });
  }

  /**
   * Shuffles cards of a given stack
   * @param stack stack
   */
  public shuffleStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      let index = 0;

      // Assign new indices to shuffled cards
      CardsService.shuffleCards(stack.cards).forEach(card => {
        card.index = index++;
      });

      resolve();
    });
  }

  /**
   * Restores card order (reverse chronological)
   * @param stack stack
   */
  public restoreCardOrder(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      let index = 0;

      stack.cards.sort((cardA, cardB) => {
        return new Date(cardB.creationDate).getTime() < new Date(cardA.creationDate).getTime() ? 1 : -1;
      }).forEach(card => {
        card.index = index++;
      });

      resolve();
    });
  }

  /**
   * Toggles favorite
   * @param card card
   * @param favorite favorite
   */
  public setFavorite(card: Card, favorite: boolean) {
    LogService.trace(`CardsService#setFavorite`);
    return new Promise((resolve) => {
      card.favorite = favorite;
      resolve();
    });
  }

  /**
   * Toggles vice versa
   */
  public toggleViceVersa() {
    this.viceVersa = !this.viceVersa;
  }

  //
  // Lookup
  //

  /**
   * Returns the needed number of boxes
   * @param cards cards
   */
  public getBoxCount(cards: Card[]): number {
    let boxCount = 0;
    cards.forEach(card => {
      if (card.box != null && card.box > boxCount) {
        boxCount = card.box;
      }
    });

    return boxCount + 1;
  }

  /**
   * Determines whether a tag is contained in a list of cards
   * @param cards cards
   * @param tag tag
   */
  public tagIsContainedInCards(cards: Card[], tag: Tag) {
    return this.getTagIdsByCards(cards).some(id => {
      return id === tag.id;
    });
  }

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
  // Delegated: card types
  //

  /**
   * Returns a list of card types contained in a given card type group
   * @param group card type group
   */
  public getCardTypesByGroup(group: CardTypeGroup): CardType[] {
    return this.cardTypeService.getCardTypesByGroup(group);
  }

  /**
   * Returns the card type group of a given card type
   * @param type card type
   */
  public getCardGroupByType(type: CardType): CardTypeGroup {
    return this.cardTypeService.getCardGroupByType(type);
  }

  /**
   * Determines if a card type group contains a given card type
   * @param group card type group
   * @param type card type
   */
  public groupContainsType(group: CardTypeGroup, type: CardType) {
    return this.cardTypeService.groupContainsType(group, type);
  }

  /**
   * Retrieves an icon by card type
   * @param group card type group
   */
  public getIconByCardTypeGroup(group: CardTypeGroup): string {
    return this.cardTypeService.getIconByCardTypeGroup(group);
  }

  /**
   * Retrieves an icon by card type
   * @param type card type
   */
  public getIconByCardType(type: CardType): string {
    return this.cardTypeService.getIconByCardType(type);
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.cardsSubject.next(Array.from(this.cards.values()).sort(CardsService.sortCards));
  }
}
