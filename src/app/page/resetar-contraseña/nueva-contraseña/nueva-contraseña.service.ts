import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class NuevaContraseñaService {

  urlNewPassword = environment.urlUsuario

  constructor() { }

  nuevaContraseña(id: number, password: string) {
    return axios.patch(`${this.urlNewPassword}/update-password/${id}`, {
      password: password
    }).then(response => response.data)
      .catch(error => {
        console.log('Error de axios: ', error);
        throw error;  // Relanza el error para que el componente pueda manejarlo
      });
  }
}
