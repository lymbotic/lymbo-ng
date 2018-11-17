import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsModule} from './settings/settings.module';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    SettingsModule,
    UiModule
  ],
  declarations: []
})
export class CoreModule {
}
