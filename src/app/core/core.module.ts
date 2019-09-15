import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsModule} from './settings/settings.module';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';
import {TranslateModule} from './translate/translate.module';
import {UtilModule} from './common/util.module';
import {ImageModule} from './image/image.module';
import {FirebaseModule} from './firebase/firebase.module';
import {LogModule} from './log/log.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    FirebaseModule,
    ImageModule,
    LogModule,
    SettingsModule,
    TranslateModule,
    UiModule,
    UtilModule
  ],
  declarations: []
})
export class CoreModule {
}
