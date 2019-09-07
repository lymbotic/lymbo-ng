import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {AppImports} from './app.imports';
import {AppProviders} from './app.providers';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [AppImports],
  entryComponents: [],
  providers: [AppProviders],
  bootstrap: [AppComponent]
})

export class AppModule {
}
