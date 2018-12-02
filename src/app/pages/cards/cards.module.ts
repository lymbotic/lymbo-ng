import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {StackResolver} from './resolvers/stack.resolver';
import {CardDialogComponent} from './components/dialogs/card-dialog/card-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {CardFragmentComponent} from './components/card/card-fragment/card-fragment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {CardsRoutingModule} from './cards-routing.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {SideTitleFragmentComponent} from './components/fragments/side-title-fragment/side-title-fragment.component';
import {CardsComponent} from './pages/cards/cards.component';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {SideFragmentComponent} from './components/card/side-fragment/side-fragment.component';
import {TagsNamePipeModule} from '../../ui/tags-name-pipe/tags-name-pipe.module';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    CardsRoutingModule,

    AboutDialogModule,
    ConfirmationDialogModule,
    NewFeaturesDialogModule,
    TagChipsModule,
    TagsNamePipeModule
  ],
  declarations: [
    // Pages
    CardsComponent,

    // Fragments
    SideTitleFragmentComponent,

    // Dialogs
    CardDialogComponent,
    TagDialogComponent,

    // Lists
    TagListComponent,
    TagListItemComponent,

    // Toolbars
    CardsToolbarComponent,

    // Cards
    CardFragmentComponent,
    SideFragmentComponent,
  ], entryComponents: [
    // Pages
    CardsComponent,
    // Dialogs
    CardDialogComponent,
    TagDialogComponent,
  ], providers: [
    StackResolver
  ], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
