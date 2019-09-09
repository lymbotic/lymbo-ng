import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppImports} from './app.imports';
import {PouchDBSettingsService} from './core/persistence/services/pouchdb-settings.service';
import {PouchDBService} from './core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from './core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsServiceMock} from './core/persistence/services/pouchdb-settings.service.mock';
import {StacksService} from './core/entity/services/stack/stacks.service';
import {CardsService} from './core/entity/services/card/cards.service';
import {SnackbarService} from './core/ui/services/snackbar.service';
import {SettingsService} from './core/settings/services/settings.service';
import {ThemeService} from './core/ui/services/theme.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatSnackBar} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgZone, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppDeclarations} from './app.declarations';
import {AngularFireAuth} from '@angular/fire/auth';
import {of} from 'rxjs';

describe('AppComponent', () => {
  const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
  mockNgZone.run.and.callFake(fn => fn());

  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppImports, HttpClientTestingModule],
      declarations: [AppDeclarations],
      providers: [
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
