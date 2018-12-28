import { TestBed } from '@angular/core/testing';

import { MicrosoftTranslateService } from './microsoft-translate.service';

describe('MicrosoftTranslateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MicrosoftTranslateService = TestBed.get(MicrosoftTranslateService);
    expect(service).toBeTruthy();
  });
});
