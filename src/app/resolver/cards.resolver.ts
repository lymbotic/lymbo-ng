import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Stack} from '../model/stack.model';
import {StacksService} from '../services/stacks.service';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CardsResolver implements Resolve<Stack> {
  private stacksUnsubscribeSubject = new Subject();

  constructor(private router: Router,
              private stacksService: StacksService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let stack = this.stacksService.stacks.get(route.params.id);
    console.log(`DEBUG resolve ${JSON.stringify(stack)}`);
    if (stack != null) {
      return stack;
    } else {
      this.router.navigate(['/stacks']);
    }
  }
}
