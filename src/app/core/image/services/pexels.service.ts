import {EventEmitter, Injectable} from '@angular/core';
import {ConnectionService} from '../../common/services/connection.service';
import {SettingsService} from '../../settings/services/settings.service';
import {SettingType} from '../../settings/model/setting-type.enum';
import {HttpClient} from '@angular/common/http';
import {Photo} from '../model/photo.model';
import {SearchResult} from '../model/search-result';

/**
 * Handles image lookup via Pexels
 */
@Injectable({
  providedIn: 'root'
})
export class PexelsService {

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
   * @param searchItems search items
   * @param photosEmitter photos emitter
   */
  search(searchItems: string[], photosEmitter: EventEmitter<Photo[]>) {
    if (ConnectionService.isOnline()) {
      const apiKey = this.settingsService.settings.get(SettingType.API_KEY_PEXELS_IMAGE);

      if (searchItems != null && searchItems.length > 0 && apiKey != null) {
        const options = {
          method: 'GET',
          headers: {
            'Authorization': apiKey.value
          },
          json: true,
        };

        const ob = this.httpClient.post(`https://api.pexels.com/v1/search?query=${searchItems.join('+')}&per_page=15&page=1`, [{}], options);
        ob.subscribe(value => {
          photosEmitter.emit((value as SearchResult).photos);
        });
      }
    } else {
      console.error('Client is offline');
    }
  }
}
