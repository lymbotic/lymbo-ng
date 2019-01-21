import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleTranslateService} from './services/google-translate.service';
import {MicrosoftTranslateService} from './services/microsoft-translate.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    GoogleTranslateService,
    MicrosoftTranslateService
  ]
})
export class TranslateModule {
}
