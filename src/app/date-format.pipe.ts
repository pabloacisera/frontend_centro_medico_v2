import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
}
