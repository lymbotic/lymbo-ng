import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSelectionFragmentComponent} from './language-selection-fragment.component';

describe('LanguageSelectionFragmentComponent', () => {
  let component: LanguageSelectionFragmentComponent;
  let fixture: ComponentFixture<LanguageSelectionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageSelectionFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
