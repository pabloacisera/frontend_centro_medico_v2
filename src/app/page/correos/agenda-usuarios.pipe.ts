import { Pipe, PipeTransform } from '@angular/core';

interface Profesional {
  id: number;
  nombre: string;
  email: string;
}

@Pipe({
  name: 'agendaUsuarios',
  standalone: true,
})
export class AgendaUsuariosPipe implements PipeTransform {

  transform(profesionales: Profesional[], page: number = 0, search: string = ''): Profesional[] {

    if (search.length === 0)
      return profesionales.slice(page, page + 5);

    // Filtrar profesionales por nombre
    const filteredProfesionales = profesionales.filter(profesional => 
      profesional.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return filteredProfesionales.slice(page, page + 5);
  }
}
