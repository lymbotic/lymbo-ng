import { TestBed } from '@angular/core/testing';

import { StacksPouchDbService } from './stacks-pouch-db.service';

describe('StacksPouchDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StacksPouchDbService = TestBed.get(StacksPouchDbService);
    expect(service).toBeTruthy();
  });
});
