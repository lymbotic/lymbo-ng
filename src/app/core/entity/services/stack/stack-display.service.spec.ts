import {inject, TestBed} from '@angular/core/testing';

import {StackDisplayService} from './stack-display.service';

describe('CardDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StackDisplayService]
    });
  });

  it('should be created', inject([StackDisplayService], (service: StackDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
