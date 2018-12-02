import {inject, TestBed} from '@angular/core/testing';

import {CardDisplayService} from './card-display.service';

describe('CardDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardDisplayService]
    });
  });

  it('should be created', inject([CardDisplayService], (service: CardDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
