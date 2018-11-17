import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StacksComponent} from './pages/stacks/stacks.component';
import {StacksToolbarComponent} from './components/toolbars/stacks-toolbar/stacks-toolbar.component';
import {StackDialogComponent} from './components/dialogs/stack-dialog/stack-dialog.component';
import {StackComponent} from './components/stack/stack/stack.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {StacksRoutingModule} from './stacks-routing.module';
import {FileDropFragmentComponent} from './components/fragments/file-drop-fragment/file-drop-fragment.component';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,

    StacksRoutingModule,

    AboutDialogModule,
    ConfirmationDialogModule,
    NewFeaturesDialogModule
  ],
  declarations: [
    // Pages
    StacksComponent,

    // Fragments
    FileDropFragmentComponent,

    // Dialogs
    StackDialogComponent,

    // Toolbars
    StacksToolbarComponent,

    // Stacks
    StackComponent,
  ], entryComponents: [
    // Pages
    StacksComponent,
    // Dialogs
    StackDialogComponent
  ], providers: [], exports: [
    StacksComponent
  ]
})
export class StacksModule {
}
