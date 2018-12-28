import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleTranslateService} from './services/google-translate.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    GoogleTranslateService
  ]
})
export class TranslateModule {
}
