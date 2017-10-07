import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StacksComponent} from './components/stacks/stacks.component';
import {CardsComponent} from './components/cards/cards.component';

const routes: Routes = [
  {path: '', redirectTo: '/stacks', pathMatch: 'full'},
  {path: 'stacks', component: StacksComponent},
  {path: 'cards/:id', component: CardsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
