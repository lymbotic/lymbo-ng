import {async, TestBed} from '@angular/core/testing';

import {FirebaseAuthenticationService} from './firebase-authentication.service';
import {of} from 'rxjs';
import {CardsDeclarations} from '../../../pages/cards/cards.declarations';
import {CardsImports} from '../../../pages/cards/cards.imports';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseAuthenticationServiceMock} from './firebase-authentication.service.mock';

describe('FirebaseAuthenticationService', () => {

  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
      providers: [
        {provide: AngularFireAuth, use: mockAngularFireAuth},
        {provide: FirebaseAuthenticationService, use: FirebaseAuthenticationServiceMock}
      ]
    })
      .compileComponents();
  }));

  xit('should be created', () => {
    const service: FirebaseAuthenticationService = TestBed.get(FirebaseAuthenticationService);
    expect(service).toBeTruthy();
  });
});
