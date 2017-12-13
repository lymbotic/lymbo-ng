import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {PlatformService} from './services/platform.service';
import {ResponsiveModule} from 'ng2-responsive';
import {StacksToolbarComponent} from './view/toolbars/stacks-toolbar/stacks-toolbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MATERIAL_COMPATIBILITY_MODE,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule, MatCheckboxModule
} from '@angular/material';
import {FileDropComponent} from './view/components/file-drop/file-drop.component';
import {FileUploadModule} from 'ng2-file-upload';
import {StacksService} from './services/stacks.service';
import {StackComponent} from './view/components/stack/stack.component';
import {StacksComponent} from './view/pages/stacks/stacks.component';
import {AppRoutingModule} from './app-routing.module';
import {CardsComponent} from './view/pages/cards/cards.component';
import {CardComponent} from './view/components/card/card.component';
import {CardsResolver} from './resolver/cards.resolver';
import {SnackbarService} from './services/snackbar.service';
import {CardsToolbarComponent} from './view/toolbars/cards-toolbar/cards-toolbar.component';
import {SideComponent} from './view/components/side/side.component';
import {SideMenuComponent} from './view/components/side-menu/side-menu.component';
import {CardDialogComponent} from './view/dialogs/card-dialog/card-dialog.component';
import {StackDialogComponent} from './view/dialogs/stack-dialog/stack-dialog.component';
import {CardsService} from './services/cards.service';
import {ConfirmationDialogComponent} from './view/dialogs/confirmation-dialog/confirmation-dialog.component';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';
import {PouchDBService} from './services/pouchdb.service';
import { FilterCardsByPipe } from './pipes/filter-cards-by.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileDropComponent,
    StackComponent,
    StacksComponent,
    StacksToolbarComponent,
    CardComponent,
    CardsComponent,
    CardsToolbarComponent,
    SideComponent,
    SideMenuComponent,
    CardDialogComponent,
    StackDialogComponent,
    ConfirmationDialogComponent,
    SplashScreenComponent,
    FilterCardsByPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    ResponsiveModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule
  ],
  entryComponents: [
    CardDialogComponent,
    StackDialogComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    PlatformService,
    StacksService,
    CardsService,
    SnackbarService,
    PouchDBService,
    CardsResolver,
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}],
  bootstrap: [AppComponent]
})

export class AppModule {
}
