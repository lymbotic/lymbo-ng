import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackTypeFragmentComponent} from './stack-type-fragment.component';

describe('StackTypeFragmentComponent', () => {
  let component: StackTypeFragmentComponent;
  let fixture: ComponentFixture<StackTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackTypeFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackTypeFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
