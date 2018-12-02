import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterService} from './services/filter.service';
import {TagService} from './services/tag.service';
import {CardsService} from './services/card/cards.service';
import {StacksService} from './services/stack/stacks.service';
import {MatchService} from './services/match.service';

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
    TagService
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
