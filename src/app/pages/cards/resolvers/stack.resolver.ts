import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Stack} from '../../../core/entity/model/stack/stack.model';
import {StacksService} from '../../../core/entity/services/stack/stacks.service';

/**
 * Resolves stack by ID
 */
@Injectable()
export class StackResolver implements Resolve<Stack> {

  /**
   * Constructor
   * @param router router
   * @param stacksService stacks service
   */
  constructor(private router: Router,
              private stacksService: StacksService) {
  }

  /**
   * Resolves parameters
   * @param route route
   * @param state state
   */
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.stacksService.stacks.get(route.params.id);
  }
}
