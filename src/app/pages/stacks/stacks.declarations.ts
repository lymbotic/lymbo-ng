// tslint:disable-next-line:max-line-length
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {UserPopoverComponent} from './components/popovers/user-popover/user-popover.component';
import {StacksComponent} from './pages/stacks/stacks.component';
import {FileDropFragmentComponent} from './components/fragments/file-drop-fragment/file-drop-fragment.component';
import {LanguageSelectionFragmentComponent} from './components/fragments/language-selection-fragment/language-selection-fragment.component';
import {StackTitleFragmentComponent} from './components/fragments/stack-title-fragment/stack-title-fragment.component';
import {StackTypeFragmentComponent} from './components/fragments/stack-type-fragment/stack-type-fragment.component';
import {StackDialogComponent} from './components/dialogs/stack-dialog/stack-dialog.component';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {StacksToolbarComponent} from './components/toolbars/stacks-toolbar/stacks-toolbar.component';
import {StackFragmentComponent} from './components/fragments/stack-fragment/stack-fragment.component';

/**
 * Declarations of stacks module
 */
export const StacksDeclarations = [
// Pages
  StacksComponent,

  // Fragments
  FileDropFragmentComponent,
  LanguageSelectionFragmentComponent,
  StackTitleFragmentComponent,
  StackTypeFragmentComponent,

  // Dialogs
  StackDialogComponent,
  TagDialogComponent,
  UploadDialogComponent,

  // Lists
  TagListComponent,
  TagListItemComponent,

  // Toolbars
  StacksToolbarComponent,

  // Stacks
  StackFragmentComponent,

  LanguageSelectionFragmentComponent,

  UserPopoverComponent,
];
