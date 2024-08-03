import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field: string, reverse: boolean = false): any[] {
    if (!Array.isArray(array) || !field) {
      return array;
    }
    const direction = reverse ? -1 : 1;
    return array.sort((a, b) => {
      if (a[field] < b[field]) {
        return -1 * direction;
      } else if (a[field] > b[field]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }
}
