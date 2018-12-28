import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsModule} from './settings/settings.module';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';
import {TranslateModule} from './translate/translate.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    SettingsModule,
    TranslateModule,
    UiModule
  ],
  declarations: []
})
export class CoreModule {
}
