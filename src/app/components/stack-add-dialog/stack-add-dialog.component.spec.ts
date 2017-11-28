import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackAddDialogComponent } from './stack-add-dialog.component';

describe('StackAddDialogComponent', () => {
  let component: StackAddDialogComponent;
  let fixture: ComponentFixture<StackAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
