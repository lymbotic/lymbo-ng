import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackTypeFragmentComponent} from './stack-type-fragment.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';

describe('CardTypeFragmentComponent', () => {
  let component: StackTypeFragmentComponent;
  let fixture: ComponentFixture<StackTypeFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
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
