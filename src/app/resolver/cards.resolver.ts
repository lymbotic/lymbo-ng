import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Stack} from '../model/stack.model';
import {StacksService} from '../services/stacks.service';

@Injectable()
export class CardsResolver implements Resolve<Stack> {

  constructor(private stacksService: StacksService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let stack = this.stacksService.stacks.get(route.params.id);

    console.log(`DEBUG resolve ${stack.id}`);

    return stack != null ? stack : new Stack();
  }
}
