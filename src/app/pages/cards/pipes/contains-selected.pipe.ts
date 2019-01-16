import {Pipe, PipeTransform} from '@angular/core';
import {Answer} from '../../../core/entity/model/card/quiz/answer.model';

/**
 * Pipe determining whether a given array of answers contains at least one that is selected
 */
@Pipe({
  name: 'containsSelected'
})
export class ContainsSelectedPipe implements PipeTransform {

  /**
   * Determines whether a given list of answers contains at least one that is selected
   * @param value answers
   * @param args arguments
   */
  transform(value: Answer[], args?: any): boolean {
    return value.some(answer => {
      return answer.selected;
    });
  }

}
