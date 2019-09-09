import {async, TestBed} from '@angular/core/testing';

import {FirebaseCloudFirestoreService} from './firebase-cloud-firestore.service';
import {of} from 'rxjs';
import {CardsDeclarations} from '../../../pages/cards/cards.declarations';
import {CardsImports} from '../../../pages/cards/cards.imports';
import {AngularFireAuth} from '@angular/fire/auth';

describe('FirebaseCloudFirestoreService', () => {
  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
      providers: [
        {provide: AngularFireAuth, use: mockAngularFireAuth},
      ]
    })
      .compileComponents();
  }));

  it('should be created', () => {
    const service: FirebaseCloudFirestoreService = TestBed.get(FirebaseCloudFirestoreService);
    expect(service).toBeTruthy();
  });
});
