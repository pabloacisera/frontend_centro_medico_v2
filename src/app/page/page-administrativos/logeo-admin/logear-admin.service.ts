import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class LogearAdminService {

  url = environment.urlAdministrativos

  constructor() { }

  async logearAdmin(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.url}/login`, data);
      console.log('Datos de axios: ', response.data);
      return response.data; // Asegúrate de devolver solo los datos, no el objeto completo
    } catch (error) {
      console.error('Error de axios: ', error);
      throw new Error('Ha ocurrido un error de axios');
    }
  }
  
}
