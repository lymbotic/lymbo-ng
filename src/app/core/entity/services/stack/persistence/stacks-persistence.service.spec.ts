import { TestBed } from '@angular/core/testing';

import { StacksPersistenceService } from './stacks-persistence.service';

describe('StacksPersistenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StacksPersistenceService = TestBed.get(StacksPersistenceService);
    expect(service).toBeTruthy();
  });
});
