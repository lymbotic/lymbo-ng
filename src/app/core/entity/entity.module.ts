import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterService} from './services/filter.service';
import {CardsService} from './services/card/cards.service';
import {StacksService} from './services/stack/stacks.service';
import {MatchService} from './services/match.service';
import {StacksFirestoreService} from './services/stack/persistence/stacks-firestore.service';
import {TagsService} from './services/tag/tags.service';
import {StacksPouchdbService} from './services/stack/persistence/stacks-pouchdb.service';
import {STACK_PERSISTENCE_FIRESTORE, STACK_PERSISTENCE_POUCHDB} from './services/stack/model/injection-tokens';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CardsService,
    FilterService,
    MatchService,
    StacksService,
    {provide: STACK_PERSISTENCE_FIRESTORE, useClass: StacksFirestoreService},
    {provide: STACK_PERSISTENCE_POUCHDB, useClass: StacksPouchdbService},
    TagsService,
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
