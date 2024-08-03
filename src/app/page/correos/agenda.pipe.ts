import { Pipe, PipeTransform } from '@angular/core';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

@Pipe({
  name: 'agendaCliente',
  standalone: true,
})
export class AgendaPipeCliente implements PipeTransform {

  transform(clientes: Cliente[], page: number = 0, search: string = ''): Cliente[] {

    if (search.length === 0)
      return clientes.slice(page, page + 5);

    // Correctamente filtrar por el nombre del cliente
    const filteredClientes = clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return filteredClientes.slice(page, page + 5);
  }
}
