import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExamplesFragmentComponent} from './examples-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';
import {HttpClient} from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ExamplesFragmentComponent', () => {
  let component: ExamplesFragmentComponent;
  let fixture: ComponentFixture<ExamplesFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports, HttpClientTestingModule],
      providers: [
        HttpClient,
        MatIconRegistry
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
