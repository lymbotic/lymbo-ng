import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPopoverComponent} from './user-popover.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';

describe('UserPopoverComponent', () => {
  let component: UserPopoverComponent;
  let fixture: ComponentFixture<UserPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
