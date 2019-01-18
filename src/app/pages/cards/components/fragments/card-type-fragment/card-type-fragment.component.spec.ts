import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardTypeFragmentComponent} from './card-type-fragment.component';

describe('CardTypeFragmentComponent', () => {
  let component: CardTypeFragmentComponent;
  let fixture: ComponentFixture<CardTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardTypeFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTypeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
