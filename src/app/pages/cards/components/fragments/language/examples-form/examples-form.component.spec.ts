import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamplesFormComponent} from './examples-form.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('ExamplesFormComponent', () => {
  let component: ExamplesFormComponent;
  let fixture: ComponentFixture<ExamplesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
