import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SideTitleFragmentComponent} from './side-title-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';

describe('SideTitleFragmentComponent', () => {
  let component: SideTitleFragmentComponent;
  let fixture: ComponentFixture<SideTitleFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideTitleFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
