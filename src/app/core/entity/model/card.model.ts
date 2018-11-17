import {Side} from './side.model';
import {Tag} from './tag.model';
export class Card {
  id: string;
  sides: Side[] = [];
  tags: Tag[] = [];

  checked = false;

  constructor() {
    this.sides.push(new Side());
    this.sides.push(new Side());
  }
}
