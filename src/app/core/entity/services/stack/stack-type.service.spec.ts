import {inject, TestBed} from '@angular/core/testing';

import {StackTypeService} from './stack-type.service';

describe('StackTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StackTypeService]
    });
  });

  it('should be created', inject([StackTypeService], (service: StackTypeService) => {
    expect(service).toBeTruthy();
  }));
});
