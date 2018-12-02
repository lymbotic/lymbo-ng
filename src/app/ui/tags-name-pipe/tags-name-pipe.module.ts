import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagNamesPipe} from './pipes/tag-names.pipe';

@NgModule({
  declarations: [
    TagNamesPipe
  ],
  imports: [
    CommonModule
  ], exports: [
    TagNamesPipe
  ]
})
export class TagsNamePipeModule {
}
