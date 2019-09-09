import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardFragmentComponent} from './card-fragment.component';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';

describe('CardFragmentComponent', () => {
  let component: CardFragmentComponent;
  let fixture: ComponentFixture<CardFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
