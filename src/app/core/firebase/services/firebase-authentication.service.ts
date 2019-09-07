import {Inject, Injectable} from '@angular/core';
import {auth, User} from 'firebase/app';
import {Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {STACK_PERSISTENCE_FIRESTORE} from '../../entity/entity.module';
import {StacksPersistenceService} from '../../entity/services/stack/persistence/stacks-persistence.interface';

/***
 * Handles firebase authentication
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {

  /** Current user */
  user: User;
  /** Subject publishing user */
  userSubject = new Subject<User>();

  /**
   * Constructor
   * @param angularFireAuth Angular fire auth
   * @param stacksPersistenceService stacks persistence service
   */
  constructor(private angularFireAuth: AngularFireAuth,
              @Inject(STACK_PERSISTENCE_FIRESTORE) private stacksPersistenceService: StacksPersistenceService) {
    this.initializeUserSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes user subscription
   */
  private initializeUserSubscription() {
    this.angularFireAuth.user.subscribe(user => {
      this.user = user;
      this.userSubject.next(user);
    });
  }

  /**
   * Handles login with Google
   */
  loginWithGoogle() {
    // Reset subscription to prevent privilege error
    this.stacksPersistenceService.cancelSubscription();

    this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  /**
   * Handles anonymous login
   */
  loginAnonymously() {
    // Reset subscription to prevent privilege error
    this.stacksPersistenceService.cancelSubscription();

    this.angularFireAuth.auth.signInAnonymously();
  }

  /**
   * Handles logout
   */
  logout() {
    this.angularFireAuth.auth.signOut();
  }

  /**
   * Deletes a given user
   * @param user user
   */
  deleteUser(user: User) {
    user.delete();
  }
}
