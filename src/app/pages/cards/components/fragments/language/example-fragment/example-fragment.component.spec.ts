import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleFragmentComponent } from './example-fragment.component';

describe('ExampleFragmentComponent', () => {
  let component: ExampleFragmentComponent;
  let fixture: ComponentFixture<ExampleFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
