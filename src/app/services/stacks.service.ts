import {Injectable} from '@angular/core';
import {Stack} from '../model/stack.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class StacksService {
  stacks: { [id: string]: Stack; } = {};
  stacksSubject = new Subject<Stack>();

  constructor() {
  }

  /**
   * Clears all stacks
   */
  clear() {
    this.stacks = {};
    this.stacksSubject.next(null);
  }

  /**
   * Publishes all stacks the its subscribers
   */
  publish() {
    this.stacksSubject.next(null);
    for (let id in this.stacks) {
      if (id != null) {
        let stack = this.stacks[id];
        this.stacksSubject.next(stack);
      }
    }
  }

  /**
   * Adds a stack
   * @param stack stack to be added
   */
  addStack(stack: Stack) {
    this.stacks[stack.id] = stack;
    this.stacksSubject.next(stack);
  }

  /**
   * Updates a stack
   * @param stack stack to be updated
   */
  updateStack(stack: Stack) {
    this.stacks[stack.id] = stack;
  }

  /**
   * Gets a stack by a given id
   * @param id id of the stack
   * @returns {Stack}
   */
  getStack(id: number): Stack {
    return this.stacks[id] as Stack;
  }
}
