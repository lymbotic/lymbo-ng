import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Stack} from '../../entity/model/stack/stack.model';
import {User} from 'firebase';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * Handles Cloud Firestore access
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseCloudFirestoreService {

  /** Stacks collection */
  stacksCollection: AngularFirestoreCollection<Stack>;
  /** Stacks observable */
  stacksObservable: Observable<Stack[]>;
  /** Stack subject */
  stacksSubject: Subject<Stack[]>;

  /**
   * Constructor
   * @param angularFirestore Angular Firestore
   */
  constructor(private angularFirestore: AngularFirestore) {
    this.stacksObservable = new Observable<Stack[]>();
    this.stacksSubject = new Subject<Stack[]>();
  }

  /**
   * Reads stacks of a given user
   * @param user user
   */
  readStacks(user: User) {
    this.stacksCollection = this.angularFirestore.collection<Stack>('stacks',
      ref => ref.where('owner', '==', user.uid));
    this.stacksObservable = this.stacksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Stack;
        data.id = a.payload.doc.id;

        return data;
      }))
    );
    this.stacksObservable.subscribe(stacks => {
        this.stacksSubject.next(stacks);
      }
    );
  }

  /**
   * Adds a stack
   * @param stack stack
   */
  addStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      this.stacksCollection.add(stack);
      resolve();
    });
  }

  /**
   * Adds an array of stacks
   * @param stacks stacks
   */
  addStacks(stacks: Stack[]): Promise<any> {
    const batch = this.angularFirestore.firestore.batch();

    stacks.forEach(stack => {
      const id = this.angularFirestore.createId();
      const ref = this.angularFirestore.firestore.collection('stacks').doc(id);

      batch.set(ref, stack);
    });

    return batch.commit();
  }

  /**
   * Updates a stack
   * @param stack stack
   */
  updateStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      this.stacksCollection.doc(stack.id).update(stack);
      resolve();
    });
  }

  /**
   * Deletes a stack
   * @param stack stack
   */
  deleteStack(stack: Stack): Promise<any> {
    return new Promise((resolve) => {
      this.stacksCollection.doc(stack.id).delete();
      resolve();
    });
  }

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  deleteStacks(stacks: Stack[]): Promise<any> {
    const batch = this.angularFirestore.firestore.batch();

    stacks.forEach(stack => {
      const ref = this.angularFirestore.firestore.collection('stacks').doc(stack.id);

      batch.delete(ref);
    });

    return batch.commit();
  }
}
