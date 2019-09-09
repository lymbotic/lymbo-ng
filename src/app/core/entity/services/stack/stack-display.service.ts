import {Injectable} from '@angular/core';
import {Stack} from '../../model/stack/stack.model';
import {StackType} from '../../model/stack/stack-type.enum';

/**
 * Enum representing display aspects
 */
export enum DisplayAspect {
  CAN_BE_CREATED,
  CAN_BE_UPDATED,

  LANGUAGE
}

/**
 * Handles stack display options
 */
@Injectable({
  providedIn: 'root'
})
export class StackDisplayService {

  //
  // Helpers
  //

  /**
   * Determines whether a given stack can be created
   * @param stack stack
   */
  static canBeCreated(stack: Stack): boolean {
    return stack != null && stack.title != null && stack.title.length > 0;
  }

  /**
   * Determines whether a given stack can be updated
   * @param stack stack
   */
  static canBeUpdated(stack: Stack): boolean {
    return stack != null && stack.title != null && stack.title.length > 0;
  }

  /**
   * Determines whether a given stack contains languages
   * @param stack stack
   */
  static containsLanguage(stack: Stack): boolean {
    return stack != null && stack.type === StackType.LANGUAGE;
  }
}
