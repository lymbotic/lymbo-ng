import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TensesFragmentComponent} from './tenses-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('TensesFragmentComponent', () => {
  let component: TensesFragmentComponent;
  let fixture: ComponentFixture<TensesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TensesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
