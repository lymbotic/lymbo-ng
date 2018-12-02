import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DisplayAspect, StackDisplayService} from './stack-display.service';
import {Stack} from '../../model/stack.model';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {SnackbarService} from '../../../ui/services/snackbar.service';
import {TagService} from '../tag.service';
import {EntityType} from '../../model/entity-type.enum';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class StacksService {

  /** Map of all cards */
  stacks = new Map<String, Stack>();
  /** Subject that publishes cards */
  stacksSubject = new Subject<Stack[]>();

  /** Stack in focus */
  stack: Stack;
  /** Subject that publishes stack */
  stackSubject = new Subject<Stack>();

  /**
   * Constructor
   * @param pouchDBService pouchDB service
   * @param stackDisplayService stack display service
   * @param tagService tag service
   */
  constructor(private pouchDBService: PouchDBService,
              private stackDisplayService: StackDisplayService,
              private tagService: TagService) {
    this.initializeStackSubscription();
    this.findStacks();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    this.stacksSubject.subscribe((value) => {
      (value as Stack[]).forEach(stack => {
          this.stacks.set(stack.id, stack);
        }
      );
    });
  }

  /**
   * Loads cards
   */
  public findStacks() {
    const index = {fields: ['entityType']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.STACK}}
        ]
      },
    };

    this.clearStacks();
    this.findStacksInternal(index, options);
  }

  /**
   * Loads stack by a given ID
   * @param {number} id ID of filter by
   */
  public findStackByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        '$and': [
          {entityType: {$eq: EntityType.STACK}},
          {id: {$eq: id}}
        ]
      },
    };

    this.findStackInternal(index, options);
  }

  /**
   * Clears cards
   */
  private clearStacks() {
    this.stacks.clear();
  }

  /**
   * Index cards and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findStacksInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const stack = element as Stack;
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
   * Index stacks and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findStackInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          this.stack = element as Stack;
        });
        this.notify();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  //
  // Persistence
  //

  /**
   * Creates a new stack
   * @param stack stack to be created
   */
  public createStack(stack: Stack): Promise<any> {
    return new Promise(() => {

      // Update related objects
      this.updateRelatedTags(stack.tagIds);

      if (stack != null) {

        // Update related objects
        this.updateRelatedTags(stack.tagIds);

        // Create stack
        return this.pouchDBService.upsert(stack.id, stack).then(() => {
          this.stacks.set(stack.id, stack);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  public updateStack(stack: Stack): Promise<any> {
    return new Promise(() => {
      if (stack != null) {

        // Update related objects
        this.updateRelatedTags(stack.tagIds);

        stack.modificationDate = new Date();

        // Update stack
        return this.pouchDBService.upsert(stack.id, stack).then(() => {
          this.stacks.set(stack.id, stack);
          this.notify();
        });
      }
    });
  }

  /**
   * Deletes a stack
   * @param {Stack} stack stack to be deleted
   */
  public deleteStack(stack: Stack): Promise<any> {
    return new Promise(() => {
      if (stack != null) {
        return this.pouchDBService.remove(stack.id, stack).then(() => {
          this.stacks.delete(stack.id);
          this.notify();
        });
      }
    });
  }

  /**
   * Updates related tags
   * @param tagIds tag IDs
   */
  private updateRelatedTags(tagIds: string[]) {
    tagIds.forEach(id => {
      const tag = this.tagService.getTagById(id);
      this.tagService.updateTag(tag, false).then(() => {
      });
    });
  }

  //
  // Delegated: Display aspects
  //

  /**
   * Determines if a given stack contains a display aspect
   * @param displayAspect display aspect
   * @param stack stack
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, stack: Stack): boolean {
    switch (displayAspect) {
      case DisplayAspect.CAN_BE_CREATED: {
        return StackDisplayService.canBeCreated(stack);
      }
      case DisplayAspect.CAN_BE_UPDATED: {
        return StackDisplayService.canBeUpdated(stack);
      }
    }
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    this.stackSubject.next(this.stack);
    this.stacksSubject.next(Array.from(this.stacks.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }
}
