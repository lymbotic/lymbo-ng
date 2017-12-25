import {Card} from './card.model';
import {Tag} from './tag.model';
export class Stack {
  id: string;
  title: string;
  cards: Card[] = [];
  tags: Tag[] = [];
}
