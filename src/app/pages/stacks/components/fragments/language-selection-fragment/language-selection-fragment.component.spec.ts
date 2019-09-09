import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSelectionFragmentComponent} from './language-selection-fragment.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LanguageSelectionFragmentComponent', () => {
  let component: LanguageSelectionFragmentComponent;
  let fixture: ComponentFixture<LanguageSelectionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports, BrowserAnimationsModule],
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
