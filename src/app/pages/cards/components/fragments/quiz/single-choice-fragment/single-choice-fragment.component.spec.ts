import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleChoiceFragmentComponent} from './single-choice-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('SingleChoiceFragmentComponent', () => {
  let component: SingleChoiceFragmentComponent;
  let fixture: ComponentFixture<SingleChoiceFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
