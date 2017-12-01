import {Injectable} from '@angular/core';
import {Card} from '../model/card.model';
import {Subject} from 'rxjs/Subject';
import {Stack} from '../model/stack.model';
import {PouchDBService} from './pouchdb.service';

@Injectable()
export class CardsService {
  stack: Stack; // Just a helper

  cards = new Map<String, Card>();
  cardsSubject = new Subject<Card[]>();

  constructor(private pouchDBService: PouchDBService) {
  }

  public createCard(card: Card) {
    console.log(`DEBUG createCard ${card.id}`);
    this.cards.set(card.id, card);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.notify();
  }

  public updateCard(card: Card) {
    console.log(`DEBUG updateCard ${card.id}`);
    this.cards.set(card.id, card);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.notify();
  }

  public deleteCard(card: Card) {
    console.log(`DEBUG deleteCard ${card.id}`);
    this.cards.delete(card.id);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.notify();
  }

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    console.log(`DEBUG notify`);
    this.cardsSubject.next(Array.from(this.cards.values()));
  }
}
