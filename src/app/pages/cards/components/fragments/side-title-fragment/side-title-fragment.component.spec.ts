import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SideTitleFragmentComponent} from './side-title-fragment.component';

describe('SideTitleFragmentComponent', () => {
  let component: SideTitleFragmentComponent;
  let fixture: ComponentFixture<SideTitleFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideTitleFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideTitleFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
