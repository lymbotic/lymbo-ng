import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {SettingsDeclarations} from '../../settings.declarations';
import {SettingsImports} from '../../settings.imports';
import {MatIconRegistry} from '@angular/material';
import {MaterialColorService} from '../../../../core/ui/services/material-color.service';
import {MaterialIconService} from '../../../../core/ui/services/material-icon.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {SettingsService} from '../../../../core/settings/services/settings.service';
import {NgZone} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
  mockNgZone.run.and.callFake(fn => fn());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDeclarations],
      imports: [SettingsImports, HttpClientTestingModule],
      providers: [
        MatIconRegistry,
        MaterialColorService,
        MaterialIconService,
        {
          provide: Router, useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        DomSanitizer,
        ScrollDispatcher,
        SettingsService,
        {provide: NgZone, useValue: mockNgZone},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
