import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TenseFragmentComponent} from './tense-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('TenseFragmentComponent', () => {
  let component: TenseFragmentComponent;
  let fixture: ComponentFixture<TenseFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenseFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
