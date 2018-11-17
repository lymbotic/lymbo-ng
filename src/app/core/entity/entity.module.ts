import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsService} from './services/cards.service';
import {PouchDBService} from './services/pouchdb.service';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {StacksService} from './services/stacks.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CardsService,
    PouchDBService,
    PouchDBSettingsService,
    StacksService
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
