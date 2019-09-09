import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SideFormComponent} from './side-form.component';
import {CardsDeclarations} from '../../../../cards.declarations';
import {CardsImports} from '../../../../cards.imports';
import {HttpClientModule} from '@angular/common/http';
import {MatIconRegistry} from '@angular/material';

describe('SideFormComponent', () => {
  let component: SideFormComponent;
  let fixture: ComponentFixture<SideFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports, HttpClientModule],
      providers: [
        MatIconRegistry
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
