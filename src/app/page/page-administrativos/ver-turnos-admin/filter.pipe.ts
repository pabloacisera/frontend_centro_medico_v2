import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, clientes: { [id: number]: any }): any[] {
    if (!items) return [];
    if (!searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      const clienteNombre = clientes[item.clienteId]?.nombre?.toLowerCase() || '';
      const fecha = new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toLowerCase();
      const hora = new Date(item.fecha).toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();

      return clienteNombre.includes(searchTerm) ||
             fecha.includes(searchTerm) ||
             hora.includes(searchTerm);
    });
  }
}



