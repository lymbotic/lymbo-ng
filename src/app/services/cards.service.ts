import {Injectable} from '@angular/core';
import {Card} from '../model/card.model';
import {Subject} from 'rxjs/Subject';
import {Stack} from '../model/stack.model';

@Injectable()
export class CardsService {
  cards: { [id: string]: Card; } = {};
  cardsSubject = new Subject<Card>();

  constructor() {
  }

  /**
   * Clears all cards
   */
  clear() {
    this.cards = {};
    this.cardsSubject.next(null);
  }

  /**
   * Publishes all cards the its subscribers
   * @param stack stack
   */
  publish(stack: Stack) {
    for (let id in stack.cards) {
      if (id != null) {
        let card = stack.cards[id];
        this.cardsSubject.next(card);
      }
    }
  }

  /**
   * Adds a card to the current stack
   * @param card card to be added
   */
  addCard(card: Card) {
    this.cards[card.id] = card;
    this.cardsSubject.next(card);
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
