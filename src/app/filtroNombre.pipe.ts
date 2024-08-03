import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroNombre'
})
export class FiltroNombrePipe implements PipeTransform {

  transform(items: any[], filtro: string): any[] {
    if (!items || !filtro) {
      return items;
    }

    const filtroLower = filtro.toLowerCase();

    return items.filter(item => {
      // Asegúrate de que item.nombre existe antes de intentar llamar toLowerCase
      return item.nombre && item.nombre.toLowerCase().includes(filtroLower);
    });
  }
}

