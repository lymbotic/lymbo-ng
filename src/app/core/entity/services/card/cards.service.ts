import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Stack} from '../../model/stack.model';
import {Card} from '../../model/card.model';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {StacksService} from '../stack/stacks.service';
import {TagService} from '../tag.service';
import {DisplayAspect} from '../stack/stack-display.service';
import {CardDisplayService} from './card-display.service';

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
   * @param pouchDBService pouchDB service
   * @param stackService stack service
   * @param tagService tag service
   */
  constructor(private pouchDBService: PouchDBService,
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
    return new Promise(() => {
      if (card != null) {

        // Update related objects
        this.updateRelatedTags(card.tagIds);
        this.addCardToStack(this.stack, card);

        // Create card
        /*
        return this.pouchDBService.upsert(card.id, card).then(() => {
          this.cards.set(card.id, card);
          this.notify();
        });
        */
      }
    });
  }

  /**
   * Updates an existing card
   * @param card card to be updated
   */
  public updateCard(card: Card): Promise<any> {
    return new Promise(() => {
      if (card != null) {
        card.modificationDate = new Date();

        // Update related objects
        this.updateRelatedTags(card.tagIds);
        this.updateCardOfStack(this.stack, card);


        // Update card
        /*
        return this.pouchDBService.upsert(card.id, card).then(() => {
          this.cards.set(card.id, card);
          this.notify();
        });
        */
      }
    });
  }

  /**
   * Deletes a card
   * @param {Card} card card to be deleted
   */
  public deleteCard(card: Card): Promise<any> {
    return new Promise(() => {
      if (card != null) {

        this.removeCardFromStack(this.stack, card);

        // Delete card
        /*
        return this.pouchDBService.remove(card.id, card).then(() => {
          this.cards.delete(card.id);
          this.notify();
        });
        */
      }
    });
  }

  /**
   * Updates related tags
   * @param tagIds tag IDs
   */
  private updateRelatedTags(tagIds: string[]) {
    tagIds.forEach(id => {
      const tag = this.tagService.getTagById(id);
      this.tagService.updateTag(tag, false).then(() => {
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
    return new Promise(() => {
      card.modificationDate = new Date();

      this.updateCard(card);

      this.updateRelatedStack(stack).then(() => {
        this.notify();
      });
    });
  }

  /**
   * Updates related stack
   * @param stack stack
   */
  private updateRelatedStack(stack: Stack): Promise<any> {
    return new Promise(() => {
      this.stackService.updateStack(stack);
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
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.cardsSubject.next(Array.from(this.cards.values()).sort(this.sortCards));
  }
}
