import {Injectable} from '@angular/core';
import {User} from 'firebase/app';
import {Subject} from 'rxjs';

/***
 * Handles firebase authentication
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationServiceMock {

  /** Current user */
  user: User;
  /** Subject publishing user */
  userSubject = new Subject<User>();

  /**
   * Constructor
   */
  constructor() {
    this.initializeUserSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes user subscription
   */
  private initializeUserSubscription() {
  }

  /**
   * Handles login with Google
   */
  loginWithGoogle() {
  }

  /**
   * Handles anonymous login
   */
  loginAnonymously() {
  }

  /**
   * Handles logout
   */
  logout() {
  }

  /**
   * Deletes a given user
   * @param user user
   */
  deleteUser(user: User) {
    user.delete();
  }
}
