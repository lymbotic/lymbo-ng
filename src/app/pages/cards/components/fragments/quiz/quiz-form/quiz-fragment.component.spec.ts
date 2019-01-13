import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFragmentComponent } from './quiz-fragment.component';

describe('QuizFragmentComponent', () => {
  let component: QuizFragmentComponent;
  let fixture: ComponentFixture<QuizFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
