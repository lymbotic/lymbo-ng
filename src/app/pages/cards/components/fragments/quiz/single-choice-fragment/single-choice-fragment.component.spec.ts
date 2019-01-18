import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceFragmentComponent } from './single-choice-fragment.component';

describe('SingleChoiceFragmentComponent', () => {
  let component: SingleChoiceFragmentComponent;
  let fixture: ComponentFixture<SingleChoiceFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceFragmentComponent ]
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
