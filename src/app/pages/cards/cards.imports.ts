import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {CardsRoutingModule} from './cards-routing.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {MarkdownFragmentModule} from '../../ui/markdown-fragment/markdown-fragment.module';
import {CheckableListModule} from '../../ui/checkable-list/checkable-list.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';
import {SuggestedActionButtonModule} from '../../ui/suggested-action-button/suggested-action-button.module';
import {TagChipsModule} from '../../ui/tag-chips/tag-chips.module';
import {TagsNamePipeModule} from '../../ui/tags-name-pipe/tags-name-pipe.module';
import {FirebaseModule} from '../../core/firebase/firebase.module';
import {SwingModule} from 'angular2-swing';

/**
 * Imports of cards module
 */
export const CardsImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,

  SwingModule,

  CardsRoutingModule,

  FirebaseModule,

  AboutDialogModule,
  CheckableListModule,
  ConfirmationDialogModule,
  MarkdownFragmentModule,
  NewFeaturesDialogModule,
  SuggestedActionButtonModule,
  TagChipsModule,
  TagsNamePipeModule
];
