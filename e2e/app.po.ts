import { browser, element, by } from 'protractor';

/**
 * Protractor test for Basalt page
 */
export class LymboPage {

  /**
   * Navigates to home page
   * @returns {promise.Promise<any>}
   */
  navigateTo() {
    return browser.get('/');
  }

  /**
   * Retreives paragraph text
   * @returns {any} paragraph text
   */
  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
