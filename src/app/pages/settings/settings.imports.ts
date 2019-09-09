import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {SettingsRoutingModule} from './settings-routing.module';

/**
 * Imports of settings module
 */
export const SettingsImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ScrollDispatchModule,
  MaterialModule,
  SettingsRoutingModule
];
