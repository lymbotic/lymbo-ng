import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterService} from './services/filter.service';
import {CardsService} from './services/card/cards.service';
import {StacksService} from './services/stack/stacks.service';
import {MatchService} from './services/match.service';
import {StacksPersistenceService} from './services/stack/persistence/stacks-persistence.interface';
import {StacksFirestoreService} from './services/stack/persistence/stacks-firestore.service';
import {TagsService} from './services/tag/tags.service';

// Injection tokens
export let STACK_PERSISTENCE = new InjectionToken<StacksPersistenceService>('app.stack-persistence');

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
    {provide: STACK_PERSISTENCE, useClass: StacksFirestoreService},
    TagsService,
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
