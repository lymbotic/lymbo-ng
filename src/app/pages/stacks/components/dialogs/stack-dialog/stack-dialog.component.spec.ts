import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackDialogComponent} from './stack-dialog.component';

describe('CardDialogComponent', () => {
  let component: StackDialogComponent;
  let fixture: ComponentFixture<StackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackDialogComponent]
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
