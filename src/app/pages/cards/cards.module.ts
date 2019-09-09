import {NgModule} from '@angular/core';
import {StackResolver} from './resolvers/stack.resolver';
import {CardDialogComponent} from './components/dialogs/card-dialog/card-dialog.component';
import {TagDialogComponent} from './components/dialogs/tag-dialog/tag-dialog.component';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsDeclarations} from './cards.declarations';
import {CardsImports} from './cards.imports';

@NgModule({
  imports: [CardsImports],
  declarations: [CardsDeclarations],
  entryComponents: [
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
