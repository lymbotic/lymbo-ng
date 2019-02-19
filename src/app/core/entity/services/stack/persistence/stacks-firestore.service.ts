import {Injectable} from '@angular/core';
import {StacksPersistenceService} from './stacks-persistence.interface';
import {Subject} from 'rxjs/Subject';
import {User} from 'firebase';
import {Stack} from '../../../model/stack/stack.model';
import {FirebaseCloudFirestoreService} from '../../../../firebase/services/firebase-cloud-firestore.service';
import {TagsService} from '../../tag/tags.service';

/**
 * Handles stack persistence via Firestore
 */
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
   * @param tagsService tags service
   */
  constructor(private firebaseCloudFirestoreService: FirebaseCloudFirestoreService,
              private tagsService: TagsService) {
    this.initializeStacksSubscription();
    this.initializeStackSubscription();
    this.notifyMultipleStacks();
    this.notifySingleStack();
  }

  //
  // Initialization
  //

  /**
   * Initializes stacks subscription from Firestore
   */
  private initializeStacksSubscription() {
    this.firebaseCloudFirestoreService.stacksSubject.subscribe(stacks => {
      stacks.forEach(element => {
        const stack = element as Stack;
        this.stacks.set(stack.id, stack);
      });
      this.notifyMultipleStacks();
    });
  }

  /**
   * Initializes stack subscription from Firestore
   */
  private initializeStackSubscription() {
    this.firebaseCloudFirestoreService.stackSubject.subscribe(stack => {
      this.stack = stack;
      this.notifySingleStack();
    });
  }

  //
  // Read
  //

  /**
   * Loads stacks from Firestore
   * @param user user
   */
  public findStacks(user: User) {
    this.firebaseCloudFirestoreService.readStacks(user);
  }

  /**
   * Finds stack by a given ID
   * @param id ID of the stack
   * @param user user
   */
  public findStackByID(id: string, user: User) {
    this.firebaseCloudFirestoreService.readStacksByID(user, id);
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
      this.updateRelatedTags(stack, stack.tagIds);

      // Create stack
      return this.firebaseCloudFirestoreService.addStack(stack).then(() => {
        this.notifyMultipleStacks();
        resolve();
      }).catch(err => {
        console.error(err);
      });
    });
  }

  /**
   * Creates new stacks
   * @param stacks stacks to be created
   */
  public createStacks(stacks: Stack[]): Promise<any> {
    return new Promise((resolve) => {

      // Create stacks
      return this.firebaseCloudFirestoreService.addStacks(stacks).then(() => {
        this.notifyMultipleStacks();
        resolve();
      });
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
      this.updateRelatedTags(stack, stack.tagIds);

      // Set modification date
      stack.modificationDate = new Date();

      // Update stack
      return this.firebaseCloudFirestoreService.updateStack(stack).then(() => {
        this.notifyMultipleStacks();
        this.notifySingleStack();
        resolve();
      });
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

      // Delete stack
      return this.firebaseCloudFirestoreService.deleteStack(stack).then(() => {
        this.notifyMultipleStacks();
        resolve();
      });
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
        this.notifyMultipleStacks();
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
   * Clears stacks
   */
  public clearStacks() {
    this.stacks.clear();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notifyMultipleStacks() {
    this.stacksSubject.next(Array.from(this.stacks.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() - new Date(t1.modificationDate).getTime();
    }));
  }

  /**
   * Informs subscribers that something has changed
   */
  public notifySingleStack() {
    this.stackSubject.next(this.stack);
  }

  //
  // Internal
  //

  /**
   * Updates related tags
   * @param stack stack
   * @param tagIds tag IDs
   */
  private updateRelatedTags(stack: Stack, tagIds: string[]) {
    tagIds.forEach(id => {
      const tag = this.tagsService.getTagById(id);
      this.tagsService.updateTag(stack, tag).then(() => {
      }).catch(err => {
        console.error(err);
      });
    });
  }
}
