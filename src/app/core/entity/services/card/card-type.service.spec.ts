import { TestBed } from '@angular/core/testing';

import { CardTypeService } from './card-type.service';

describe('CardTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardTypeService = TestBed.get(CardTypeService);
    expect(service).toBeTruthy();
  });
});
