import {TestBed} from '@angular/core/testing';

import {FirebaseCloudFirestoreService} from './firebase-cloud-firestore.service';

describe('FirebaseCloudFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseCloudFirestoreService = TestBed.get(FirebaseCloudFirestoreService);
    expect(service).toBeTruthy();
  });
});
