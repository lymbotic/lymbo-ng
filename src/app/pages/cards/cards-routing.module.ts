import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StackResolver} from './resolvers/stack.resolver';
import {CardsComponent} from './pages/cards/cards.component';

const routes: Routes = [
  {path: '', component: CardsComponent},
  {path: 'cards/:uid', component: CardsComponent, resolve: {stack: StackResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule {
}
