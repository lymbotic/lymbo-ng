import {NgModule} from '@angular/core';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './pages/settings/settings.component';
import {SettingsDeclarations} from './settings.declarations';

@NgModule({
  imports: [SettingsRoutingModule],
  declarations: [SettingsDeclarations],
  entryComponents: [
    // Pages
    SettingsComponent
  ]
})
export class SettingsModule {
}
