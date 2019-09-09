import {TestBed} from '@angular/core/testing';

import {StacksPouchdbService} from './stacks-pouchdb.service';
import {PouchDBService} from '../../../../persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../persistence/services/pouchdb-settings.service.mock';

describe('StacksPouchdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: PouchDBService, useClass: PouchDBServiceMock},
      {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
    ]
  }));

  it('should be created', () => {
    const service: StacksPouchdbService = TestBed.get(StacksPouchdbService);
    expect(service).toBeTruthy();
  });
});
