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
    TagChipsModule,
    TagsNamePipeModule
  ],
  declarations: [
    // Pages
    StacksComponent,

    // Fragments
    FileDropFragmentComponent,
    StackTitleFragmentComponent,

    // Dialogs
    StackDialogComponent,
    TagDialogComponent,

    // Lists
    TagListComponent,
    TagListItemComponent,

    // Toolbars
    StacksToolbarComponent,

    // Stacks
    StackFragmentComponent,
  ], entryComponents: [
    // Pages
    StacksComponent,
    // Dialogs
    StackDialogComponent,
    TagDialogComponent,
  ], providers: [], exports: [
    StacksComponent
  ]
})
export class StacksModule {
}
