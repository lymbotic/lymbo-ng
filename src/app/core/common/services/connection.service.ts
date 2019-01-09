import {Injectable, Renderer, Renderer2} from '@angular/core';
import {Observable} from 'rxjs';
import {Renderer3} from '@angular/core/src/render3/interfaces/renderer';

/**
 * Checks internet connection
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  static isOnline(): boolean {
    return navigator.onLine;
  }
}
