import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplesFragmentComponent } from './examples-fragment.component';

describe('ExamplesFragmentComponent', () => {
  let component: ExamplesFragmentComponent;
  let fixture: ComponentFixture<ExamplesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamplesFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
