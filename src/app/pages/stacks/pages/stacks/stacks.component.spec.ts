import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StacksComponent} from './stacks.component';
import {StacksDeclarations} from '../../stacks.declarations';
import {StacksImports} from '../../stacks.imports';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {FirebaseAuthenticationService} from '../../../../core/firebase/services/firebase-authentication.service';
import {FirebaseCloudFirestoreService} from '../../../../core/firebase/services/firebase-cloud-firestore.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MatchService} from '../../../../core/entity/services/match.service';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {MicrosoftTranslateService} from '../../../../core/translate/services/microsoft-translate.service';
import {PexelsService} from '../../../../core/image/services/pexels.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {StacksService} from '../../../../core/entity/services/stack/stacks.service';
import {NgZone} from '@angular/core';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {TagsService} from '../../../../core/entity/services/tag/tags.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseAuthenticationServiceMock} from '../../../../core/firebase/services/firebase-authentication.service.mock';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('StacksComponent', () => {
  let component: StacksComponent;
  let fixture: ComponentFixture<StacksComponent>;

  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
  mockNgZone.run.and.callFake(fn => fn());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports, HttpClientTestingModule],
      providers: [
        CardsService,
        FilterService,
        {provide: AngularFireAuth, use: mockAngularFireAuth},
        {provide: FirebaseAuthenticationService, use: FirebaseAuthenticationServiceMock},
        FirebaseCloudFirestoreService,
        MatIconRegistry,
        MatchService,
        MaterialColorService,
        MaterialIconService,
        MediaService,
        MicrosoftTranslateService,
        PexelsService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        DomSanitizer,
        ScrollDispatcher,
        SettingsService,
        StacksService,
        // StacksPersistenceService,
        SnackbarService,
        SuggestionService,
        TagsService,
        MatDialog,
        {provide: NgZone, useValue: mockNgZone},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
