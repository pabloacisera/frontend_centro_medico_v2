import { HttpClientXsrfModule } from '@angular/common/http'
import { Pipe, PipeTransform } from '@angular/core'

export interface Cliente {
  id: number
  protocolo: number
  nombre: string
  email: string
}


@Pipe({
  name: 'uploadFile',
  standalone: true
})
export class UploadFilePipe implements PipeTransform {

  transform(value: Cliente[], page: number = 0, text: string = ''): Cliente[] {
    
    if(text.length === 0)
      return value.slice(page, page + 5);// si no se ha buscado se muestra totalidad de los registros del slice

    const filteredTextByNombre = value.filter( cliente => cliente.nombre.includes( text ) )

    return filteredTextByNombre.slice(page, page + 5);
  }
}
