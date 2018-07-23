import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {PlatformService} from './services/platform.service';
import {StacksToolbarComponent} from './view/toolbars/stacks-toolbar/stacks-toolbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
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
import {TagDialogComponent} from './view/dialogs/tag-dialog/tag-dialog.component';
import {AboutDialogComponent} from './view/dialogs/about-dialog/about-dialog.component';
import {NewFeaturesDialogComponent} from './view/dialogs/new-features-dialog/new-features-dialog.component';
import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {SettingsService} from './services/settings.service';
import {HttpClientModule} from '@angular/common/http';
import {FilterCardsByPipe} from './pipes/filter-cards-by.pipe';

@NgModule({
  declarations: [
    AboutDialogComponent,
    AppComponent,
    FileDropComponent,
    FilterCardsByPipe,
    NewFeaturesDialogComponent,
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
    TagDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
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
    AboutDialogComponent,
    CardDialogComponent,
    NewFeaturesDialogComponent,
    StackDialogComponent,
    ConfirmationDialogComponent,
    TagDialogComponent
  ],
  providers: [
    PlatformService,
    StacksService,
    CardsService,
    SnackbarService,
    PouchDBService,
    PouchDBSettingsService,
    SettingsService,
    CardsResolver
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
