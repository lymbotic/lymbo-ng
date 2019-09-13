import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsStackFragmentComponent} from './cards-stack-fragment.component';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';

describe('CardsStackFragmentComponent', () => {
  let component: CardsStackFragmentComponent;
  let fixture: ComponentFixture<CardsStackFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsStackFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
