import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class ResetearContraseñaAdminService {

  url = environment.urlAdministrativos

  constructor() { }

  async solicitarReseteo(data: { email: string, rol: string }) {
    try {
      const response = await axios.post(`${this.url}/reset-password`, data);
      return response.data; // Asegúrate de devolver solo los datos si es necesario
    } catch (error) {
      console.error('Error de axios:', error.message);
      throw new Error('Error de axios: ' + error.message);
    }
  }
}
