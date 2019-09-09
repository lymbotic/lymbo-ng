import {NgModule} from '@angular/core';
import {StacksComponent} from './pages/stacks/stacks.component';
import {StackDialogComponent} from './components/dialogs/stack-dialog/stack-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {UploadDialogComponent} from './components/dialogs/upload-dialog/upload-dialog.component';
import {StacksImports} from './stacks.imports';
import {StacksDeclarations} from './stacks.declarations';

@NgModule({
  imports: [StacksImports],
  declarations: [StacksDeclarations],
  entryComponents: [
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
