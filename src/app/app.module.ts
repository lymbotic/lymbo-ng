import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './ui/material/material.module';
import {NewFeaturesDialogModule} from './ui/new-features-dialog/new-features-dialog.module';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,

    MaterialModule,

    // Core service
    CoreModule,

    NewFeaturesDialogModule,

    // Pages (loaded via lazy loading)
    // StacksModule,
    // CardsModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
