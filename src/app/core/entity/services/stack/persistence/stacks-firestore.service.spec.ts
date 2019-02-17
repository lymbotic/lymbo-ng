import {TestBed} from '@angular/core/testing';

import {StacksFirestoreService} from './stacks-firestore.service';

describe('StacksFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StacksFirestoreService = TestBed.get(StacksFirestoreService);
    expect(service).toBeTruthy();
  });
});
