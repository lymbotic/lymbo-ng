import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Stack} from '../../model/stack/stack.model';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {StacksService} from '../stack/stacks.service';
import {TagService} from '../tag.service';
import {CardDisplayService, DisplayAspect} from './card-display.service';
import {CardTypeService} from './card-type.service';
import {Card} from '../../model/card/card.model';
import {CardTypeGroup} from '../../model/card/card-type-group.enum';
import {CardType} from '../../model/card/card-type.enum';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class CardsService {

  /** Stack in focus */
  stack: Stack;

  /** Map of all cards */
  cards = new Map<String, Card>();
  /** Subject that publishes cards */
  cardsSubject = new Subject<Card[]>();

  /**
   * Constructor
   * @param cardTypeService card type service
   * @param pouchDBService pouchDB service
   * @param stackService stack service
   * @param tagService tag service
   */
  constructor(private cardTypeService: CardTypeService,
              private pouchDBService: PouchDBService,
              private stackService: StacksService,
              private tagService: TagService) {
  }

  //
  // Initialization
  //

  /**
   * Initializes stack
   * @param stack stack
   */
  public initializeStack(stack: Stack) {
    this.stack = stack;
  }

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
   * @param card card to be created
   */
  public createCard(card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      this.addCardToStack(this.stack, card);
      resolve();
    });
  }

  /**
   * Updates an existing card
   * @param card card to be updated
   */
  public updateCard(card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }

      // Set modification date
      card.modificationDate = new Date();

      this.updateCardOfStack(this.stack, card);
      resolve();
    });
  }

  /**
   * Deletes a card
   * @param {Card} card card to be deleted
   */
  public deleteCard(card: Card): Promise<any> {
    return new Promise((resolve, reject) => {
      if (card == null) {
        reject();
      }


      this.removeCardFromStack(this.stack, card);
      resolve();
    });
  }

  /**
   * Updates related tags
   * @param card card
   */
  public updateRelatedTags(card: Card): Promise<any> {
    return new Promise((resolve) => {
      card.tagIds.forEach(id => {
        const tag = this.tagService.getTagById(id);
        this.tagService.updateTag(tag, false).then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Adds card to stack
   * @param stack stack
   * @param card card
   */
  private addCardToStack(stack: Stack, card: Card) {
    this.stack.cards.push(card);
    this.updateRelatedStack(stack).then(() => {
      this.notify();
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

    this.updateRelatedStack(stack).then(() => {
      this.notify();
    });
  }

  /**
   * Removes card from stack
   * @param stack stack
   * @param card card
   */
  private removeCardFromStack(stack: Stack, card: Card) {
    // Filter out the card
    this.stack.cards = this.stack.cards.filter(c => {
      return c.id !== card.id;
    });

    this.updateRelatedStack(stack).then(() => {
      this.notify();
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
      card.modificationDate = new Date();
      this.updateCard(card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Toggles favorite
   * @param stack stack
   * @param card card
   * @param favorite favorite
   */
  public setFavorite(stack: Stack, card: Card, favorite: boolean) {
    return new Promise((resolve) => {
      card.favorite = favorite;
      this.updateCard(card).then(() => {
        resolve();
      });
    });
  }

  /**
   * Updates related stack
   * @param stack stack
   */
  private updateRelatedStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      this.stackService.updateStack(stack).then(() => {
        resolve();
      });
    });
  }

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given cardlet contains a display aspect
   * @param displayAspect display aspect
   * @param card card
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, card: Card): boolean {
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
      case DisplayAspect.VOCABULARY: {
        return CardDisplayService.containsVocabulary(card);
      }
      case DisplayAspect.QUIZ: {
        return CardDisplayService.containsQuiz(card);
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
  public sortCards(cardA: Card, cardB: Card) {
    return new Date(cardA.modificationDate).getTime() - new Date(cardB.modificationDate).getTime();
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
    this.cardsSubject.next(Array.from(this.cards.values()).sort(this.sortCards));
  }
}
