import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackDialogComponent} from './stack-dialog.component';
import {StacksDeclarations} from '../../../stacks.declarations';
import {StacksImports} from '../../../stacks.imports';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

describe('CardDialogComponent', () => {
  let component: StackDialogComponent;
  let fixture: ComponentFixture<StackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksDeclarations],
      imports: [StacksImports],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}}, {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
