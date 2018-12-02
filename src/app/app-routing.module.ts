import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'stacks', pathMatch: 'full'},
  {path: 'stacks', loadChildren: './pages/stacks/stacks.module#StacksModule'},
  {path: 'cards', loadChildren: './pages/cards/cards.module#CardsModule'},
  {path: 'cards/:id', loadChildren: './pages/cards/cards.module#CardsModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
