import {NgModule} from '@angular/core';
import {SettingsComponent} from './pages/settings/settings.component';
import {SettingsDeclarations} from './settings.declarations';
import {SettingsImports} from './settings.imports';

@NgModule({
  imports: [SettingsImports],
  declarations: [SettingsDeclarations],
  entryComponents: [
    // Pages
    SettingsComponent
  ]
})
export class SettingsModule {
}
