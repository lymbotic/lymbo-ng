import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackTitleFragmentComponent} from './stack-title-fragment.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';

describe('SideTitleFragmentComponent', () => {
  let component: StackTitleFragmentComponent;
  let fixture: ComponentFixture<StackTitleFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
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
