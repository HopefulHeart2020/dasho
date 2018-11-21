import { Pipe, PipeTransform } from '@angular/core';
import { Setting } from './setting';

@Pipe({
  name: 'sort'
})
/**
 * Represent the array sort pipe
 */
export class ArraySort implements PipeTransform {

  transform(array: Setting[], args: any): Setting[] {
    if (array) {
      return array.sort((a, b) => {
        if (a.position > b.position) {
          return 1;
        }
        if (a.position < b.position) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    } {
      return null;
    }
  }
}
