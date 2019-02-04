import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationFragmentComponent } from './information-fragment.component';

describe('InformationFragmentComponent', () => {
  let component: InformationFragmentComponent;
  let fixture: ComponentFixture<InformationFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
