import {Injectable} from '@angular/core';
import {Card} from '../model/card.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CardsService {
  cards: { [id: string]: Card; } = {};
  cardsAddSubject = new Subject<Card>();
  cardsDeleteSubject = new Subject<Card>();

  constructor() {
  }

  /**
   * Clears all cards
   */
  clear() {
    this.cards = {};
    this.cardsAddSubject.next(null);
  }

  /**
   * Adds a card to the current stack
   * @param card card to be added
   */
  addCard(card: Card) {
    console.log(`DEBUG addCard() ${card.id}`);
    this.cards[card.id] = card;
    this.cardsAddSubject.next(card);
  }

  /**
   * Updates an existing card
   * @param card card to be updated
   */
  updateCard(card: Card) {
    this.cards[card.id] = card;
  }

  /**
   * Deletes an existing card
   * @param card card to be deleted
   */
  deleteCard(card: Card) {
    delete this.cards[card.id];
    this.cardsDeleteSubject.next(card);
  }

  /**
   * Gets a card by a given id
   * @param id id of the card
   * @returns {Card}
   */
  getCard(id: number): Card {
    return this.cards[id] as Card;
  }
}
