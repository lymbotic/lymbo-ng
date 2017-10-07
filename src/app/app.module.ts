import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {PlatformService} from './services/platform.service';
import {ResponsiveModule} from 'ng2-responsive';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCardModule, MdMenuModule, MdSnackBarModule, MdToolbarModule} from '@angular/material';
import {FileDropComponent} from './components/file-drop/file-drop.component';
import {FileUploadModule} from 'ng2-file-upload';
import {StacksService} from './services/stacks.service';
import {StackComponent} from './components/stack/stack.component';
import {StacksComponent} from './components/stacks/stacks.component';
import {AppRoutingModule} from './app-routing.module';
import {CardsComponent} from './components/cards/cards.component';
import {CardComponent} from './components/card/card.component';
import {CardsResolver} from './resolver/cards.resolver';

@NgModule({
  declarations: [
    AppComponent,
    FileDropComponent,
    ToolbarComponent,
    StackComponent,
    StacksComponent,
    CardsComponent,
    CardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NoopAnimationsModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    ResponsiveModule,
    MdButtonModule,
    MdToolbarModule,
    MdSnackBarModule,
    MdCardModule,
    MdMenuModule
  ],
  providers: [PlatformService, StacksService, CardsResolver],
  bootstrap: [AppComponent]
})

export class AppModule {
}
