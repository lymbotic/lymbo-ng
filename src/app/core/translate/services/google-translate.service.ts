import {Language} from '../../entity/model/language/language.enum';
import {EventEmitter, Injectable} from '@angular/core';

/**
 * Handles calls to Google Translate API
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {

  /**
   * Translates a given word into a target language
   * @param text source text
   * @param target target language
   * @param translationEmitter translation emitter
   */
  static translate(text: string, target: Language, translationEmitter: EventEmitter<string>) {
  }
}
