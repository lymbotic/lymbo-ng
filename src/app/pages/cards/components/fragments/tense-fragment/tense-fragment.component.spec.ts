import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenseFragmentComponent } from './tense-fragment.component';

describe('TenseFragmentComponent', () => {
  let component: TenseFragmentComponent;
  let fixture: ComponentFixture<TenseFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenseFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenseFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
