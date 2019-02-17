import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {StackResolver} from './resolvers/stack.resolver';
import {CardDialogComponent} from './components/dialogs/card-dialog/card-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {CardFragmentComponent} from './components/fragments/card-fragment/card-fragment.component';
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
import {ExamplesFormComponent} from './components/fragments/language/examples-form/examples-form.component';
import {TensesFragmentComponent} from './components/fragments/language/tenses-fragment/tenses-fragment.component';
import {TenseFragmentComponent} from './components/fragments/language/tense-fragment/tense-fragment.component';
import {CardTypeFragmentComponent} from './components/fragments/card-type-fragment/card-type-fragment.component';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import {QuizFormComponent} from './components/fragments/quiz/quiz-form/quiz-form.component';
import {CheckableListModule} from '../../ui/checkable-list/checkable-list.module';
import {SideFormComponent} from './components/fragments/side/side-form/side-form.component';
import {ContainsSelectedPipe} from './pipes/contains-selected.pipe';
import {SingleChoiceFragmentComponent} from './components/fragments/quiz/single-choice-fragment/single-choice-fragment.component';
import {MarkdownFragmentModule} from '../../ui/markdown-fragment/markdown-fragment.module';
import {InformationFragmentComponent} from './components/fragments/language/information-fragment/information-fragment.component';
import {MultipleChoiceFragmentComponent} from './components/fragments/quiz/multiple-choice-fragment/multiple-choice-fragment.component';
import {TensesFormComponent} from './components/fragments/language/tenses-form/tenses-form.component';
import {UserPopoverComponent} from './components/popovers/user-popover/user-popover.component';

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
    MarkdownFragmentModule,
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
    ExamplesFormComponent,
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

    SideFormComponent,

    TensesFormComponent,
    TensesFragmentComponent,
    TenseFragmentComponent,

    ExamplesFormComponent,
    ExamplesFragmentComponent,
    ExampleFragmentComponent,

    InformationFragmentComponent,

    QuizFormComponent,
    SingleChoiceFragmentComponent,
    MultipleChoiceFragmentComponent,

    // Pipes
    ContainsSelectedPipe,

    InformationFragmentComponent,

    QuizFormComponent,

    MultipleChoiceFragmentComponent,

    UserPopoverComponent
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
