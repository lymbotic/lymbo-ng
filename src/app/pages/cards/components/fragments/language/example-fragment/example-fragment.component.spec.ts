import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExampleFragmentComponent} from './example-fragment.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';

describe('ExampleFragmentComponent', () => {
  let component: ExampleFragmentComponent;
  let fixture: ComponentFixture<ExampleFragmentComponent>;

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
    fixture = TestBed.createComponent(ExampleFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
