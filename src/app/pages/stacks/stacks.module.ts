import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StacksComponent} from './pages/stacks/stacks.component';
import {StacksToolbarComponent} from './components/toolbars/stacks-toolbar/stacks-toolbar.component';
import {StackDialogComponent} from './components/dialogs/stack-dialog/stack-dialog.component';
import {StackFragmentComponent} from './components/stack/stack-fragment/stack-fragment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {StacksRoutingModule} from './stacks-routing.module';
import {FileDropFragmentComponent} from './components/fragments/file-drop-fragment/file-drop-fragment.component';
import {FileUploadModule} from 'ng2-file-upload';
import {StackTitleFragmentComponent} from './components/fragments/stack-title-fragment/stack-title-fragment.component';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {TagsNamePipeModule} from '../../ui/tags-name-pipe/tags-name-pipe.module';
import {TagListComponent} from './components/lists/tag-list/tag-list.component';
import {TagListItemComponent} from './components/lists/tag-list-item/tag-list-item.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {StackTypeFragmentComponent} from './components/fragments/stack-type-fragment/stack-type-fragment.component';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import { LanguageSelectionFragmentComponent } from './components/fragments/language-selection-fragment/language-selection-fragment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InformationDialogModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,

    StacksRoutingModule,

    AboutDialogModule,
    ConfirmationDialogModule,
    NewFeaturesDialogModule,
    SuggestedActionButtonModule,
    TagChipsModule,
    TagsNamePipeModule
  ],
  declarations: [
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
  ], entryComponents: [
    // Pages
    StacksComponent,
    // Dialogs
    StackDialogComponent,
    TagDialogComponent,
    UploadDialogComponent
  ], providers: [], exports: [
    StacksComponent
  ]
})
export class StacksModule {
}
