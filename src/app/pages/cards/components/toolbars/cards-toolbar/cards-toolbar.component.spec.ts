import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsToolbarComponent} from './cards-toolbar.component';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CardsToolbarComponent', () => {
  let component: CardsToolbarComponent;
  let fixture: ComponentFixture<CardsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports, BrowserAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
