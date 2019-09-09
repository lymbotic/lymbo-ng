import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsComponent} from './cards.component';
import {CardsDeclarations} from '../../cards.declarations';
import {CardsImports} from '../../cards.imports';
import {FirebaseAuthenticationService} from '../../../../core/firebase/services/firebase-authentication.service';
import {FirebaseAuthenticationServiceMock} from '../../../../core/firebase/services/firebase-authentication.service.mock';
import {of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatchService} from '../../../../core/entity/services/match.service';
import {CardsService} from '../../../../core/entity/services/card/cards.service';
import {FilterService} from '../../../../core/entity/services/filter.service';
import {FirebaseCloudFirestoreService} from '../../../../core/firebase/services/firebase-cloud-firestore.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {MediaService} from '../../../../core/ui/services/media.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {NgZone} from '@angular/core';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';
import {SuggestionService} from '../../../../core/entity/services/suggestion.service';
import {TagsService} from '../../../../core/entity/services/tag/tags.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {StacksPersistenceServiceMock} from '../../../../core/entity/services/stack/persistence/stacks-persistence.mock';
import {STACK_PERSISTENCE_FIRESTORE} from '../../../../core/entity/entity.module';

xdescribe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
  mockNgZone.run.and.callFake(fn => fn());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports, HttpClientTestingModule],
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
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 'mock'})
          }
        },
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        DomSanitizer,
        ScrollDispatcher,
        SettingsService,
        {provide: STACK_PERSISTENCE_FIRESTORE, use: StacksPersistenceServiceMock},
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
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
