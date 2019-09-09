import {TestBed} from '@angular/core/testing';

import {MicrosoftTranslateService} from './microsoft-translate.service';
import {HttpClientModule} from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';

describe('MicrosoftTranslateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      MatIconRegistry
    ]
  }));

  it('should be created', () => {
    const service: MicrosoftTranslateService = TestBed.get(MicrosoftTranslateService);
    expect(service).toBeTruthy();
  });
});
