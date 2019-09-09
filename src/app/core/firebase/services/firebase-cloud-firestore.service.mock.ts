import {Injectable} from '@angular/core';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {Stack} from '../../entity/model/stack/stack.model';
import {User} from 'firebase';
import {Observable, Subject} from 'rxjs';

/**
 * Handles Cloud Firestore access
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseCloudFirestoreServiceMock {

  /** Stacks collection */
  stacksCollection: AngularFirestoreCollection<Stack>;

  /** Stacks observable */
  stacksObservable: Observable<Stack[]>;
  /** Stack subject */
  stacksSubject: Subject<Stack[]>;

  /** Stack observable */
  stackObservable: Observable<Stack[]>;
  /** Stack subject */
  stackSubject: Subject<Stack>;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   */
  constructor() {
    this.stacksObservable = new Observable<Stack[]>();
    this.stacksSubject = new Subject<Stack[]>();
    this.stackObservable = new Observable<Stack[]>();
    this.stackSubject = new Subject<Stack>();
  }

  /**
   * Cancels subscription
   */
  cancelSubscription() {
  }

  /**
   * Reads stacks of a given user
   * @param user user
   */
  readStacks(user: User) {
  }

  /**
   * Reads a stack of a given user having a given ID
   * @param user user
   * @param id stack ID
   */
  readStacksByID(user: User, id: string) {
  }

  /**
   * Adds a stack
   * @param stack stack
   */
  addStack(stack: Stack): Promise<any> {
    return null;
  }

  /**
   * Adds an array of stacks
   * @param stacks stacks
   */
  addStacks(stacks: Stack[]): Promise<any> {
    return null;
  }

  /**
   * Updates a stack
   * @param stack stack
   */
  updateStack(stack: Stack): Promise<any> {
    return null;
  }

  /**
   * Updates an array of stacks
   * @param stacks stacks
   */
  updatesStacks(stacks: Stack[]): Promise<any> {
    return null;
  }

  /**
   * Deletes a stack
   * @param stack stack
   */
  deleteStack(stack: Stack): Promise<any> {
    return null;
  }

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  deleteStacks(stacks: Stack[]): Promise<any> {
    return null;
  }
}
