import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StacksComponent} from './view/pages/stacks/stacks.component';
import {CardsComponent} from './view/pages/cards/cards.component';
import {CardsResolver} from './resolver/cards.resolver';
import {SplashScreenComponent} from './view/pages/splash-screen/splash-screen.component';

const routes: Routes = [
  {path: '', component: SplashScreenComponent},
  {path: 'stacks', component: StacksComponent},
  {
    path: 'cards/:id', component: CardsComponent, resolve: {
    stack: CardsResolver
  }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
