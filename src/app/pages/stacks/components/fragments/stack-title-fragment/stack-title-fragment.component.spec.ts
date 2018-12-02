import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackTitleFragmentComponent} from './stack-title-fragment.component';

describe('SideTitleFragmentComponent', () => {
  let component: StackTitleFragmentComponent;
  let fixture: ComponentFixture<StackTitleFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackTitleFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackTitleFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
