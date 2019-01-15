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
import {SideTitleFragmentComponent} from './components/fragments/side/side-title-fragment/side-title-fragment.component';
import {CardsComponent} from './pages/cards/cards.component';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {TagsNamePipeModule} from '../../ui/tags-name-pipe/tags-name-pipe.module';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {ExampleFragmentComponent} from './components/fragments/language/example-fragment/example-fragment.component';
import {ExamplesFragmentComponent} from './components/fragments/language/examples-fragment/examples-fragment.component';
import {VocabularyFormComponent} from './components/fragments/language/vocabulary-form/vocabulary-form.component';
import {TensesFragmentComponent} from './components/fragments/language/tenses-fragment/tenses-fragment.component';
import {TenseFragmentComponent} from './components/fragments/language/tense-fragment/tense-fragment.component';
import {CardTypeFragmentComponent} from './components/fragments/card-type-fragment/card-type-fragment.component';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import { QuizFormComponent } from './components/fragments/quiz/quiz-form/quiz-form.component';
import {CheckableListModule} from '../../ui/checkable-list/checkable-list.module';
import { SideFormComponent } from './components/fragments/side/side-form/side-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    CardsRoutingModule,

    AboutDialogModule,
    CheckableListModule,
    ConfirmationDialogModule,
    NewFeaturesDialogModule,
    SuggestedActionButtonModule,
    TagChipsModule,
    TagsNamePipeModule
  ],
  declarations: [
    // Pages
    CardsComponent,

    // Fragments
    CardTypeFragmentComponent,
    ExamplesFragmentComponent,
    VocabularyFormComponent,
    SideTitleFragmentComponent,
    TensesFragmentComponent,

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

    TenseFragmentComponent,
    TensesFragmentComponent,
    ExampleFragmentComponent,
    ExamplesFragmentComponent,
    QuizFormComponent,
    SideFormComponent,
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
