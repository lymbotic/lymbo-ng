import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FirebaseAuthenticationService} from './services/firebase-authentication.service';
import {AngularFirestoreModule, FirestoreSettingsToken} from '@angular/fire/firestore';
import {AngularFireAuthModule, AngularFireAuth} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
  ], providers: [
    {provide: FirestoreSettingsToken, useValue: {}},
    AngularFireAuth,
    FirebaseAuthenticationService
  ]
})
export class FirebaseModule {
}
