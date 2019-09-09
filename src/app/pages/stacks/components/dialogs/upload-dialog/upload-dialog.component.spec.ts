import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadDialogComponent} from './upload-dialog.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PouchDBService} from '../../../../../core/persistence/services/pouchdb.service';
import {PouchDBServiceMock} from '../../../../../core/persistence/services/pouchdb.service.mock';
import {PouchDBSettingsService} from '../../../../../core/persistence/services/pouchdb-settings.service';
import {PouchDBSettingsServiceMock} from '../../../../../core/persistence/services/pouchdb-settings.service.mock';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseAuthenticationService} from '../../../../../core/firebase/services/firebase-authentication.service';
import {FirebaseAuthenticationServiceMock} from '../../../../../core/firebase/services/firebase-authentication.service.mock';
import {of} from 'rxjs';
import {FirebaseCloudFirestoreService} from '../../../../../core/firebase/services/firebase-cloud-firestore.service';
import {FirebaseCloudFirestoreServiceMock} from '../../../../../core/firebase/services/firebase-cloud-firestore.service.mock';
import {Inject} from '@angular/core';
import {STACK_PERSISTENCE_FIRESTORE} from '../../../../../core/entity/entity.module';
import {StacksPersistenceService} from '../../../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {StacksPersistenceServiceMock} from '../../../../../core/entity/services/stack/persistence/stacks-persistence.mock';

describe('UploadDialogComponent', () => {
  let component: UploadDialogComponent;
  let fixture: ComponentFixture<UploadDialogComponent>;

  const authState: firebase.User = null;
  const mockAngularFireAuth: any = {authState: of(authState)};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {provide: AngularFireAuth, use: mockAngularFireAuth},
        {provide: FirebaseAuthenticationService, use: FirebaseAuthenticationServiceMock},
        {provide: FirebaseCloudFirestoreService, useClass: FirebaseCloudFirestoreServiceMock},
        {provide: STACK_PERSISTENCE_FIRESTORE, use: StacksPersistenceServiceMock},
        {provide: PouchDBService, useClass: PouchDBServiceMock},
        {provide: PouchDBSettingsService, useClass: PouchDBSettingsServiceMock},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
