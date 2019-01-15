import {EventEmitter, Injectable} from '@angular/core';
import {Language} from '../../entity/model/card/language.enum';

/**
 * Handles calls to Google Translate API
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {

  /**
   * Translates a given word into a target tense
   * @param text source text
   * @param target target tense
   * @param translationEmitter translation emitter
   */
  static translate(text: string, target: Language, translationEmitter: EventEmitter<string>) {
  }
}
