import {EventEmitter, Injectable} from '@angular/core';
import {UUID} from '../../entity/model/uuid';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../settings/services/settings.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {SettingType} from '../../settings/model/setting-type.enum';
import {ConnectionService} from '../../common/services/connection.service';
import {Language} from '../../entity/model/card/language.enum';

/**
 * Handles calls to Microsoft Text Translation API
 */
@Injectable({
  providedIn: 'root'
})
export class MicrosoftTranslateService {

  /**
   * Returns the code of a given tense
   * @param language tense
   */
  static getLanguageCode(language: Language): string {
    switch (language) {
      case Language.AFRIKAANS:
        return 'af';
      case Language.ARABIC:
        return 'ar';
      case Language.BANGLA:
        return 'bangla';
      case Language.BOSNIAN_LATIN:
        return 'bs';
      case Language.BULGARIAN:
        return 'bg';
      case Language.CANTONESE:
        return 'yue';
      case Language.CATALAN:
        return 'ca';
      case Language.CHINESE_SIMPLIFIED:
        return 'zh-Hans';
      case Language.CHINESE_TRADITIONAL:
        return 'zh-Hant';
      case Language.CROATION:
        return 'hr';
      case Language.CZECH:
        return 'cs';
      case Language.DANISH:
        return 'da';
      case Language.DUTCH:
        return 'nl';
      case Language.ENGLISH:
        return 'en';
      case Language.ESTONIAN:
        return 'et';
      case Language.FIJAN:
        return 'fj';
      case Language.FILIPINO:
        return 'fil';
      case Language.FINNISH:
        return 'fi';
      case Language.FRENCH:
        return 'fr';
      case Language.GERMAN:
        return 'de';
      case Language.GREEK:
        return 'el';
      case Language.HAITIAN_CREOLE:
        return 'ht';
      case Language.HEBREW:
        return 'he';
      case Language.HINDI:
        return 'hi';
      case Language.HMONG_DAW:
        return 'mww';
      case Language.HUNGARIAN:
        return 'hu';
      case Language.ICELANDIC:
        return 'is';
      case Language.INDONESIAN:
        return 'id';
      case Language.ITALIAN:
        return 'it';
      case Language.JAPANESE:
        return 'ja';
      case Language.KISWAHILI:
        return 'sw';
      case Language.KLINGON:
        return 'tlh';
      case Language.KLINGON_PLQAD:
        return 'tlh-Qaak';
      case Language.KOREAN:
        return 'ko';
      case Language.LATVIAN:
        return 'lv';
      case Language.LITHUANIAN:
        return 'lt';
      case Language.MALAGASY:
        return 'mg';
      case Language.MALAY:
        return 'ms';
      case Language.MALTESE:
        return 'mt';
      case Language.NORWEGIAN:
        return 'nb';
      case Language.PERSIAN:
        return 'af';
      case Language.POLISH:
        return 'pl';
      case Language.PORTUGUESE:
        return 'pt';
      case Language.QUERETARO_OTOMI:
        return 'otq';
      case Language.ROMANIAN:
        return 'ro';
      case Language.RUSSION:
        return 'ru';
      case Language.SAMOAN:
        return 'sm';
      case Language.SERBIAN_CYRILLIC:
        return 'sr-Cyrl';
      case Language.SERBIAN_LATIN:
        return 'sr-Latn';
      case Language.SLOVAK:
        return 'sk';
      case Language.SLOVENIAN:
        return 'sl';
      case Language.SPANISH:
        return 'es';
      case Language.SWEDISH:
        return 'sv';
      case Language.TAHITIAN:
        return 'ty';
      case Language.TAMIL:
        return 'ta';
      case Language.TELUGU:
        return 'te';
      case Language.THAI:
        return 'th';
      case Language.TONGAN:
        return 'to';
      case Language.TURKISH:
        return 'tr';
      case Language.UKRAINIAN:
        return 'uk';
      case Language.URDU:
        return 'ur';
      case Language.VIETNAMESE:
        return 'vi';
      case Language.WELSH:
        return 'cy';
      case Language.YUCATEC_MAYA:
        return 'yua';
      default:
        return null;
    }
  }

  /**
   * Constructor
   * @param connectionService connection service
   * @param settingsService settings service
   * @param httpClient http client
   */
  constructor(private connectionService: ConnectionService,
              private settingsService: SettingsService,
              private httpClient: HttpClient) {
  }

  /**
   * Translates a given word into a target tense
   * @param text source text
   * @param target target tense
   * @param translationEmitter translation emitter
   */
  translate(text: string, target: Language, translationEmitter: EventEmitter<string>) {

    if (ConnectionService.isOnline()) {
      const languageCode = MicrosoftTranslateService.getLanguageCode(target);
      const apiKey = this.settingsService.settings.get(SettingType.API_KEY_MICROSOFT_TEXT_TRANSLATE);

      if (text != null && languageCode != null && apiKey != null && translationEmitter != null) {
        const options = {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey.value,
            'Content-type': 'application/json',
            'X-ClientTraceId': new UUID().toString()
          },
          json: true,
        };

        const ob = this.httpClient.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${languageCode}`, [{
          'text': text
        }], options);
        ob.subscribe(value => {
          translationEmitter.emit(value[0]['translations'][0]['text']);
        });
      }
    } else {
      console.error('Client is offline');
    }
  }
}
