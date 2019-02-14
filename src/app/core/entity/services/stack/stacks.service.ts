import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DisplayAspect, StackDisplayService} from './stack-display.service';
import {Stack} from '../../model/stack/stack.model';
import {PouchDBService} from '../../../persistence/services/pouchdb.service';
import {TagService} from '../tag.service';
import {EntityType} from '../../model/entity-type.enum';
import {StackTypeGroup} from '../../model/stack/stack-type-group.enum';
import {StackType} from '../../model/stack/stack-type.enum';
import {StackTypeService} from './stack-type.service';
import {Tag} from '../../model/tag.model';
import {FirebaseCloudFirestoreService} from '../../../firebase/services/firebase-cloud-firestore.service';
import {User} from 'firebase';

/**
 * Handles cards
 */
@Injectable({
  providedIn: 'root'
})
export class StacksService {

  /** Map of all stacks */
  stacks = new Map<String, Stack>();
  /** Subject that publishes stacks */
  stacksSubject = new Subject<Stack[]>();

  /** Stack in focus */
  stack: Stack;
  /** Subject that publishes stack */
  stackSubject = new Subject<Stack>();

  /**
   * Constructor
   * @param firebaseCloudFirestoreService Firebase Cloud Firestore service
   * @param pouchDBService pouchDB service
   * @param stackDisplayService stack display service
   * @param stackTypeService stack type service
   * @param tagService tag service
   */
  constructor(private firebaseCloudFirestoreService: FirebaseCloudFirestoreService,
              private pouchDBService: PouchDBService,
              private stackDisplayService: StackDisplayService,
              private stackTypeService: StackTypeService,
              private tagService: TagService) {
    // this.initializeStackSubscription();
    // this.findStacksInPouchDB();

    this.initializeStackSubscriptionFirestore();
    this.notify();
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
   * Initializes stack subscription from Firestore
   */
  private initializeStackSubscriptionFirestore() {
    this.firebaseCloudFirestoreService.stacksSubject.subscribe(stacks => {
      stacks.forEach(element => {
        const stack = element as Stack;
        this.stacks.set(stack.id, stack);
      });
      this.notify();
    });
  }

  //
  //
  //

  /**
   * Loads stacks from PouchDB
   */
  public findStacksInPouchDB() {
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
   * Loads stacks from Firestore
   */
  public findStacksInFirestore(user: User) {
    this.firebaseCloudFirestoreService.readStacks(user);
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
  public clearStacks() {
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
    return new Promise((resolve, reject) => {

      if (stack == null) {
        reject();
      }

      // Update related objects
      this.updateRelatedTags(stack.tagIds);

      // Update related objects
      this.updateRelatedTags(stack.tagIds);

      // Define follow-up
      const followUp = () => {
        this.notify();
        resolve();
      };

      // Create stack
      // return this.pouchDBService.upsert(stack.id, stack).then(followUp);
      return this.firebaseCloudFirestoreService.addStack(stack).then(followUp);
    });
  }

  /**
   * Creates new stacks
   * @param stacks stacks to be created
   */
  public createStacks(stacks: Stack[]): Promise<any> {
    return new Promise((resolve) => {
      // Define follow-up
      const followUp = () => {
        this.notify();
        resolve();
      };

      // Create stacks
      return this.firebaseCloudFirestoreService.addStacks(stacks).then(followUp);
    });
  }

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  public updateStack(stack: Stack): Promise<any> {
    return new Promise((resolve, reject) => {
      if (stack == null) {
        reject();
      }

      // Update related objects
      this.updateRelatedTags(stack.tagIds);

      // Set modification date
      stack.modificationDate = new Date();

      // Define follow-up
      const followUp = () => {
        this.notify();
        resolve();
      };

      // Update stack
      // return this.pouchDBService.upsert(stack.id, stack).then(followUp);
      return this.firebaseCloudFirestoreService.updateStack(stack).then(followUp);
    });
  }

  /**
   * Deletes a stack
   * @param {Stack} stack stack to be deleted
   */
  public deleteStack(stack: Stack): Promise<any> {
    return new Promise((resolve, reject) => {
      if (stack == null) {
        reject();
      }

      // Define follow-up
      const followUp = () => {
        this.notify();
        resolve();
      };

      // Delete stack
      // return this.pouchDBService.remove(stack.id, stack).then(followUp);
      return this.firebaseCloudFirestoreService.deleteStack(stack).then(followUp);
    });
  }

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  public deleteStacks(stacks: Stack[]): Promise<any> {
    return new Promise((resolve, reject) => {
      // Delete stacks
      return this.firebaseCloudFirestoreService.deleteStacks(stacks).then(() => {
      });
    });
  }

  //
  // Import / export
  //

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

  /**
   * Uploads stack
   * @param stack stack
   */
  public uploadStack(stack: Stack) {
    stack['_rev'] = null;
    stack['_id'] = null;

    // this.pouchDBService.upsert(stack.id, stack);
    this.firebaseCloudFirestoreService.addStack(stack);
  }

  //
  // Lookup
  //

  /**
   * Determines whether a tag is contained in a list of stacks
   * @param stacks stacks
   * @param tag tag
   */
  public tagIsContainedInStacks(stacks: Stack[], tag: Tag) {
    return this.getTagIdsByStacks(stacks).some(id => {
      return id === tag.id;
    });
  }

  /**
   * Aggregates all tag IDs of a list of given stacks
   * @param stacks stacks
   */
  private getTagIdsByStacks(stacks: Stack[]): string[] {
    const tagIds = new Map<string, string>();

    stacks.forEach(stack => {
      stack.tagIds.forEach(tagId => {
        tagIds.set(tagId, tagId);
      });
    });

    return Array.from(tagIds.values());
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
      case DisplayAspect.LANGUAGE: {
        return StackDisplayService.containsLanguage(stack);
      }
    }
  }

  //
  // Import/Export
  //

  /**
   * Downloads a file containing a JSON formatted array of all entities
   */
  public downloadStack(stack: Stack) {

    const fileContents = JSON.stringify(stack);
    const filename = `${stack.title}.lymbo`;
    // const filetype = 'text/plain';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  //
  // Delegated: stack types
  //

  /**
   * Returns a list of stack types contained in a given stack type group
   * @param group stack type group
   */
  public getStackTypesByGroup(group: StackTypeGroup): StackType[] {
    return this.stackTypeService.getStackTypesByGroup(group);
  }

  /**
   * Returns the stack type group of a given stack type
   * @param type stack type
   */
  public getStackGroupByType(type: StackType): StackTypeGroup {
    return this.stackTypeService.getStackGroupByType(type);
  }

  /**
   * Determines if a stack type group contains a given stack type
   * @param group stack type group
   * @param type stack type
   */
  public groupContainsType(group: StackTypeGroup, type: StackType) {
    return this.stackTypeService.groupContainsType(group, type);
  }

  /**
   * Retrieves an icon by stack type
   * @param group stack type group
   */
  public getIconByStackTypeGroup(group: StackTypeGroup): string {
    return this.stackTypeService.getIconByStackTypeGroup(group);
  }

  /**
   * Retrieves an icon by stack type
   * @param type stack type
   */
  public getIconByStackType(type: StackType): string {
    return this.stackTypeService.getIconByStackType(type);
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
