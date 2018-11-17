import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsResolver} from './resolvers/cards.resolver';
import {CardDialogComponent} from './components/dialogs/card-dialog/card-dialog.component';
import {CardComponent} from './components/card/card/card.component';
import {SideComponent} from './components/card/side/side.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../ui/material/material.module';
import {CardsRoutingModule} from './cards-routing.module';
import {AboutDialogModule} from '../../ui/about-dialog/about-dialog.module';
import {ConfirmationDialogModule} from '../../ui/confirmation-dialog/confirmation-dialog.module';
import {NewFeaturesDialogModule} from '../../ui/new-features-dialog/new-features-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    CardsRoutingModule,

    AboutDialogModule,
    ConfirmationDialogModule,
    NewFeaturesDialogModule
  ],
  declarations: [
    // Pages
    CardsComponent,

    // Dialogs
    CardDialogComponent,

    // Toolbars
    CardsToolbarComponent,

    // Cards
    CardComponent,
    SideComponent
  ], entryComponents: [
    // Pages
    CardsComponent,
    // Dialogs
    CardDialogComponent
  ], providers: [
    CardsResolver
  ], exports: [
    CardsComponent
  ]
})
export class CardsModule {
}
