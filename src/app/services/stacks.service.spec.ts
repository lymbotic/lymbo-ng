import {inject, TestBed} from '@angular/core/testing';

import {StacksService} from './stacks.service';

describe('StacksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StacksService]
    });
  });

  it('should ...', inject([StacksService], (service: StacksService) => {
    expect(service).toBeTruthy();
  }));
});
