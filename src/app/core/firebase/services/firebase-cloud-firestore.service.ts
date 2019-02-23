import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Stack} from '../../entity/model/stack/stack.model';
import {User} from 'firebase';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {CloneService} from '../../entity/services/clone.service';

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

  /** Stack observable */
  stackObservable: Observable<Stack[]>;
  /** Stack subject */
  stackSubject: Subject<Stack>;

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param angularFirestore Angular Firestore
   */
  constructor(private angularFirestore: AngularFirestore) {
    this.stacksObservable = new Observable<Stack[]>();
    this.stacksSubject = new Subject<Stack[]>();
    this.stackObservable = new Observable<Stack[]>();
    this.stackSubject = new Subject<Stack>();
  }

  /**
   * Cancels subscription
   */
  cancelSubscription() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
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
        return a.payload.doc.data() as Stack;
      }))
    );
    this.stacksObservable.pipe(
      takeUntil(this.unsubscribeSubject)
    ).subscribe(stacks => {
        this.stacksSubject.next(stacks);
      }
    );
  }

  /**
   * Reads a stack of a given user having a given ID
   * @param user user
   * @param id stack ID
   */
  readStacksByID(user: User, id: string) {
    this.stacksCollection = this.angularFirestore.collection<Stack>('stacks',
      ref => ref
        .where('owner', '==', user.uid)
        .where('id', '==', id)
        .limit(1));
    this.stackObservable = this.stacksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        return a.payload.doc.data() as Stack;
      }))
    );
    this.stackObservable.subscribe(stacks => {
        const stack = (stacks as Stack[])[0];
        this.stackSubject.next(stack);
      }
    );
  }

  /**
   * Adds a stack
   * @param stack stack
   */
  addStack(stack: Stack): Promise<any> {
    const s = CloneService.cloneStack(stack);

    return new Promise((resolve) => {
      this.stacksCollection.doc(s.id).set(s);
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
      const s = CloneService.cloneStack(stack);

      const id = s.id;
      const ref = this.angularFirestore.firestore.collection('stacks').doc(id);

      batch.set(ref, s);
    });

    return batch.commit();
  }

  /**
   * Updates a stack
   * @param stack stack
   */
  updateStack(stack: Stack): Promise<any> {
    const s = CloneService.cloneStack(stack);

    return new Promise((resolve) => {
      this.stacksCollection.doc(stack.id).update(s).then(() => {
      });
      resolve();
    });
  }

  /**
   * Updates an array of stacks
   * @param stacks stacks
   */
  updatesStacks(stacks: Stack[]): Promise<any> {
    const batch = this.angularFirestore.firestore.batch();

    stacks.forEach(stack => {
      const s = CloneService.cloneStack(stack);

      const id = s.id;
      const ref = this.angularFirestore.firestore.collection('stacks').doc(id);

      batch.set(ref, s);
    });

    return batch.commit();
  }

  /**
   * Deletes a stack
   * @param stack stack
   */
  deleteStack(stack: Stack): Promise<any> {
    const s = CloneService.cloneStack(stack);

    return new Promise((resolve) => {
      this.stacksCollection.doc(s.id).delete().then(() => {
      });
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
      const s = CloneService.cloneStack(stack);

      const ref = this.angularFirestore.firestore.collection('stacks').doc(s.id);

      batch.delete(ref);
    });

    return batch.commit();
  }
}
