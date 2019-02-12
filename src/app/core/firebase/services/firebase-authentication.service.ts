import {Injectable} from '@angular/core';
import {auth, User} from 'firebase/app';
import {Subject} from 'rxjs/Subject';
import {AngularFireAuth} from '@angular/fire/auth';

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
   */
  constructor(private angularFireAuth: AngularFireAuth) {
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
    this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  /**
   * Handles logout
   */
  logout() {
    this.angularFireAuth.auth.signOut();
  }
}
