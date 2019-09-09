import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultipleChoiceFragmentComponent} from './multiple-choice-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('MultipleChoiceFragmentComponent', () => {
  let component: MultipleChoiceFragmentComponent;
  let fixture: ComponentFixture<MultipleChoiceFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
