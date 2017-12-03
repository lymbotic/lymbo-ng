import {Injectable} from '@angular/core';
import {Card} from '../model/card.model';
import {Subject} from 'rxjs/Subject';
import {Stack} from '../model/stack.model';
import {PouchDBService} from './pouchdb.service';
import {SnackbarService} from './snackbar.service';

@Injectable()
export class CardsService {
  stack: Stack; // Just a helper

  cards = new Map<String, Card>();
  cardsSubject = new Subject<Card[]>();

  constructor(private snackbarService: SnackbarService,
              private pouchDBService: PouchDBService) {
  }

  public createCard(card: Card) {
    console.log(`DEBUG createCard ${card.id}`);
    this.cards.set(card.id, card);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Created card`, '');
    this.notify();
  }

  public updateCard(card: Card) {
    console.log(`DEBUG updateCard ${card.id}`);
    this.cards.set(card.id, card);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Updated card`, '');
    this.notify();
  }

  public deleteCard(card: Card) {
    console.log(`DEBUG deleteCard ${card.id}`);
    this.cards.delete(card.id);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Deleted card`, '');
    this.notify();
  }

  public putCardAside(card: Card) {
    console.log(`DEBUG putCardAside ${card.id}`);
    this.cards.get(card.id).checked = true;
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Put card aside`, '');
    this.notify();
  }

  public putCardToEnd(card: Card) {
    console.log(`DEBUG putCardToEnd ${card.id}`);
    this.cards.delete(card.id);
    this.cards.set(card.id, card);
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Put card to end`, '');
    this.notify();
  }

  public uncheckAll() {
    console.log(`DEBUG uncheckAll`);
    this.cards.forEach(c => {
      c.checked = false;
    });
    this.stack.cards = Array.from(this.cards.values());
    this.pouchDBService.put(this.stack.id, this.stack);
    this.snackbarService.showSnackbar(`Recovered all cards`, '');
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
