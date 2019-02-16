import {Injectable} from '@angular/core';
import {StacksPersistenceService} from './stacks-persistence.interface';
import {Subject} from 'rxjs/Subject';
import {User} from 'firebase';
import {Stack} from '../../../model/stack/stack.model';
import {TagService} from '../../tag.service';
import {FirebaseCloudFirestoreService} from '../../../../firebase/services/firebase-cloud-firestore.service';

@Injectable({
  providedIn: 'root'
})
export class StacksFirestoreService implements StacksPersistenceService {

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
   * @param tagService tag service
   */
  constructor(private firebaseCloudFirestoreService: FirebaseCloudFirestoreService,
              private tagService: TagService) {
    this.initializeStackSubscription();
    this.notify();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack subscription from Firestore
   */
  private initializeStackSubscription() {
    this.firebaseCloudFirestoreService.stacksSubject.subscribe(stacks => {
      stacks.forEach(element => {
        const stack = element as Stack;
        this.stacks.set(stack.id, stack);
      });
      this.notify();
    });
  }

  //
  // Read
  //

  /**
   * Loads stacks from Firestore
   */
  public findStacks(user: User) {
    console.log(`findStacks ${user.uid}`);
    this.firebaseCloudFirestoreService.readStacks(user);
  }

  /**
   * Finds stack by a given ID
   * @param {number} id ID of filter by
   */
  findStackByID(id: string) {
  }

  //
  // Create
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

  //
  // Update
  //

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

  //
  // Delete
  //

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
      return this.firebaseCloudFirestoreService.deleteStack(stack).then(followUp);
    });
  }

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  public deleteStacks(stacks: Stack[]): Promise<any> {
    return new Promise((resolve) => {
      // Delete stacks
      return this.firebaseCloudFirestoreService.deleteStacks(stacks).then(() => {
        resolve();
      });
    });
  }

  //
  // Others
  //

  /**
   * Uploads a stack
   * @param stack stack
   */
  public uploadStack(stack: Stack): Promise<any> {
    stack['_rev'] = null;
    stack['_id'] = null;

    return this.firebaseCloudFirestoreService.addStack(stack);
  }

  /**
   * Clears cards
   */
  public clearStacks() {
    this.stacks.clear();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notify() {
    console.log(`notify ${this.stacks.size}`);
    this.stackSubject.next(this.stack);
    this.stacksSubject.next(Array.from(this.stacks.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  //
  // Internal
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
}
