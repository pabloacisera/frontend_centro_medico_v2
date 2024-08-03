import { Injectable } from '@angular/core';

import axios from 'axios';
import { environment } from '../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class NuevaFichaService {

  apiUrl = environment.urlCliente

  constructor() {}

  async nuevoCliente(cliente: any): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, cliente);
      return response.data;  // Asegúrate de que la API devuelva datos válidos
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error);
      throw new Error('Error al crear cliente');  // Lanza un error para manejarlo en el componente
    }
  }
}