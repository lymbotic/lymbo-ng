import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CardsComponent} from './pages/cards/cards.component';
import {CardsResolver} from './resolvers/cards.resolver';

const routes: Routes = [
  {path: '', component: CardsComponent},
  {path: 'cards/:id', component: CardsComponent, resolve: {task: CardsResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule {
}
