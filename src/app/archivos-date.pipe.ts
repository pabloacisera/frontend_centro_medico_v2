import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDoscFormat'
})
export class DateFormatDocPipe implements PipeTransform {
  transform(value: Date | string, format: 'full' | 'long' | 'medium' | 'short' = 'medium'): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    
    return new Intl.DateTimeFormat('es-ES', { dateStyle: format }).format(date);
  }
}
