import {TestBed} from '@angular/core/testing';

import {StacksFirestoreService} from './stacks-firestore.service';
import {FirebaseCloudFirestoreService} from '../../../../firebase/services/firebase-cloud-firestore.service';
import {FirebaseCloudFirestoreServiceMock} from '../../../../firebase/services/firebase-cloud-firestore.service.mock';

describe('StacksFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: FirebaseCloudFirestoreService, useClass: FirebaseCloudFirestoreServiceMock}
    ]
  }));

  it('should be created', () => {
    const service: StacksFirestoreService = TestBed.get(StacksFirestoreService);
    expect(service).toBeTruthy();
  });
});
