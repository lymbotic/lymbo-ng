import {Pipe, PipeTransform} from '@angular/core';
import {Card} from '../model/card.model';

@Pipe({
  name: 'filterCardsBy'
})
export class FilterCardsByPipe implements PipeTransform {

  transform(cards: Card[], type: string): Card[] {
    console.log(`DEBUG filterCardsBy ${type}`);

    switch (type) {
      case 'unchecked': {
        return cards.filter(c => {
          console.log(`DEBUG filterCardsBy ${c.id}, checked ${c.checked}`);
          return !c.checked;
        });
      }
    }

    return [];
  }

}
