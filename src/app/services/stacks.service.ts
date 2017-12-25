import {Injectable, isDevMode} from '@angular/core';
import {Stack} from '../model/stack.model';
import {Subject} from 'rxjs/Subject';
import {PouchDBService} from './pouchdb.service';
import {Tag} from '../model/tag.model';

@Injectable()
export class StacksService {
  stacks = new Map<String, Stack>();
  stacksSubject = new Subject<Stack[]>();
  tags: Tag[] = [];

  constructor(private pouchDBService: PouchDBService) {
    this.pouchDBService.getChangeListener().subscribe(
      item => {
        console.log(`DEBUG pouchDBService item`);
        (item['change']['docs']).forEach(d => {
          let stack = d as Stack;
          this.stacks.set(stack.id, stack);
          this.notify();
        });
      });
  }

  public createStack(stack: Stack) {
    console.log(`DEBUG createCard ${stack.id}`);
    this.stacks.set(stack.id, stack);
    this.pouchDBService.put(stack.id, stack);
    this.notify();
  }

  public updateStack(stack: Stack) {
    console.log(`DEBUG updateCard ${stack.id}`);
    this.stacks.set(stack.id, stack);
    this.pouchDBService.put(stack.id, stack);
    this.notify();
  }

  public deleteStack(stack: Stack) {
    console.log(`DEBUG deleteCard ${stack.id}`);
    this.stacks.delete(stack.id);
    this.pouchDBService.remove(stack.id, stack);
    this.notify();
  }

  /**
   * Retrieves data from PouchDB
   */
  public fetch() {
    console.log(`DEBUG fetch`);
    this.pouchDBService.fetch().then(result => {
        result.rows.forEach(r => {
          let stack = r.doc as Stack;
          console.log(`DEBUG fetch stack ${stack.id}`);
          this.stacks.set(stack.id, stack);
        });
      this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Returns an array of unique tags
   * @returns {Tag[]}
   */
  getAllTags(): Tag[] {
    let ts = [];

    this.stacks.forEach(s => {
        s.tags.forEach(t => {
          let unique = true;
          ts.forEach(tt => {
            if (t.value === tt.value) {
              unique = false;
            }
          });

          if (unique) {
            ts.push(t);
          }
        });
      }
    );

    this.tags = ts.sort((t1, t2) => {
      return (t1.value > t2.value) ? 1 : -1;
    });

    return this.tags;
  }

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    console.log(`DEBUG notify`);
    this.stacksSubject.next(Array.from(this.stacks.values()));
  }
}
