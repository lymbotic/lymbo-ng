import {CardsComponent} from './pages/cards/cards.component';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {CardFragmentComponent} from './components/fragments/card-fragment/card-fragment.component';
// tslint:disable-next-line:max-line-length
import {CardTypeFragmentComponent} from './components/fragments/card-type-fragment/card-type-fragment.component';
import {ExamplesFragmentComponent} from './components/fragments/language/examples-fragment/examples-fragment.component';
import {ExamplesFormComponent} from './components/fragments/language/examples-form/examples-form.component';
import {SideTitleFragmentComponent} from './components/fragments/side/side-title-fragment/side-title-fragment.component';
import {TensesFragmentComponent} from './components/fragments/language/tenses-fragment/tenses-fragment.component';
import {CardDialogComponent} from './components/dialogs/card-dialog/card-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {SideFormComponent} from './components/fragments/side/side-form/side-form.component';
import {TensesFormComponent} from './components/fragments/language/tenses-form/tenses-form.component';
import {TenseFragmentComponent} from './components/fragments/language/tense-fragment/tense-fragment.component';
import {ExampleFragmentComponent} from './components/fragments/language/example-fragment/example-fragment.component';
import {InformationFragmentComponent} from './components/fragments/language/information-fragment/information-fragment.component';
import {QuizFormComponent} from './components/fragments/quiz/quiz-form/quiz-form.component';
import {SingleChoiceFragmentComponent} from './components/fragments/quiz/single-choice-fragment/single-choice-fragment.component';
import {MultipleChoiceFragmentComponent} from './components/fragments/quiz/multiple-choice-fragment/multiple-choice-fragment.component';
import {ContainsSelectedPipe} from './pipes/contains-selected.pipe';
import {UserPopoverComponent} from './components/popovers/user-popover/user-popover.component';

/**
 * Declarations of cards module
 */
export const CardsDeclarations = [
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
];
