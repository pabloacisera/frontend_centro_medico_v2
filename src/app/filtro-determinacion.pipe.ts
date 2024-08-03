import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroDeterminacion',
  standalone: true
})
export class FiltroDeterminacionPipe implements PipeTransform {
  transform(items: any[], busqueda: string): any[] {
    if (!items || !busqueda) {
      return items;
    }

    return items.filter(item =>
      item.determinacion.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
}
