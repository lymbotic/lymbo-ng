import { StacksModule } from './stacks.module';

describe('StacksModule', () => {
  let stacksModule: StacksModule;

  beforeEach(() => {
    stacksModule = new StacksModule();
  });

  it('should create an instance', () => {
    expect(stacksModule).toBeTruthy();
  });
});
