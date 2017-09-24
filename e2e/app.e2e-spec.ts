import {LymboPage} from './app.po';

describe('lymbo App', function () {
  let page: LymboPage;

  beforeEach(() => {
    page = new LymboPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('app works!');
  });
});
