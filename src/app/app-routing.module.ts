import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StacksComponent} from './components/stacks/stacks.component';

const routes: Routes = [
  {path: '', redirectTo: '/stacks', pathMatch: 'full'},
  {path: 'stacks', component: StacksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
