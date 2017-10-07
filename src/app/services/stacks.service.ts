import {Injectable} from '@angular/core';
import {Stack} from '../model/stack.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class StacksService {
  stacks: { [id: string]: Stack; } = {};
  stacksSubject = new Subject<Stack>();

  constructor() {
  }

  clear() {
    this.stacks = {};
    this.stacksSubject.next(null);
  }

  addStack(stack: Stack) {
    this.stacks[stack.id] = stack;
    this.stacksSubject.next(stack);
  }

  getStack(id: number): Stack {
    return this.stacks[id];
  }
}
