import {Injectable, isDevMode} from '@angular/core';
import {Stack} from '../model/stack.model';
import {Subject} from 'rxjs/Subject';
import {MOCK_STACK} from '../model/mock/stack.mock';

@Injectable()
export class StacksService {
  stacks: { [id: string]: Stack; } = {};
  stacksSubject = new Subject<Stack>();

  constructor() {
    if (isDevMode) {
      this.stacks['0'] = MOCK_STACK;
      this.stacksSubject.next(MOCK_STACK);
    }
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
