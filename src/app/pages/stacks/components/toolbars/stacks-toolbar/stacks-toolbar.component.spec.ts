import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StacksToolbarComponent} from './stacks-toolbar.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';
import {STACK_PERSISTENCE_FIRESTORE} from '../../../../../core/entity/entity.module';
import {StacksPersistenceServiceMock} from '../../../../../core/entity/services/stack/persistence/stacks-persistence.mock';

xdescribe('StacksToolbarComponent', () => {
  let component: StacksToolbarComponent;
  let fixture: ComponentFixture<StacksToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
      providers: [
        {provide: STACK_PERSISTENCE_FIRESTORE, use: StacksPersistenceServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StacksToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
