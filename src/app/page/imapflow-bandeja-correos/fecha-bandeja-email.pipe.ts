import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaBandejaEmail',
  standalone: true,
})
export class FechaBandejaEmailPipe implements PipeTransform {

  transform(value: string, format: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    // Format date according to options
    const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);

    return formattedDate;
  }

}
