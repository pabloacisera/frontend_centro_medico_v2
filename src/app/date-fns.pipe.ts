import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns'; // Necesitarás instalar date-fns

@Pipe({
    standalone: true,
    name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: string, dateFormat: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';
    const date = parseISO(value);
    return format(date, dateFormat);
  }
}