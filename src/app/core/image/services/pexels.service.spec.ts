import {TestBed} from '@angular/core/testing';

import {PexelsService} from './pexels.service';
import {MatIconRegistry} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';

describe('PexelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      MatIconRegistry
    ]
  }));

  it('should be created', () => {
    const service: PexelsService = TestBed.get(PexelsService);
    expect(service).toBeTruthy();
  });
});
