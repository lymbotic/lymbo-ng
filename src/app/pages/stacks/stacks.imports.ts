import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {TagsNamePipeModule} from '../../ui/tags-name-pipe/tags-name-pipe.module';
import {InformationDialogModule} from '../../ui/information-dialog/information-dialog.module';
import {FileUploadModule} from 'ng2-file-upload';
import {StacksRoutingModule} from './stacks-routing.module';

/**
 * Imports of stacks module
 */
export const StacksImports = [
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
];
