import {TranslateModule} from './translate.module';

describe('TranslateModule', () => {
  let translateModule: TranslateModule;

  beforeEach(() => {
    translateModule = new TranslateModule();
  });

  it('should create an instance', () => {
    expect(translateModule).toBeTruthy();
  });
});
