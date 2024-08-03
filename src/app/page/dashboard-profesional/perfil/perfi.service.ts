import { Injectable } from '@angular/core';
import axios from 'axios'
import { environment } from '../../../../environment/development';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  url = environment.urlUsuario
  indUrl = environment.urlIndicaciones

  constructor() { }

  async obtenerUsuarioById(id:number){
    try {
      const response = await axios.get(`${this.url}/${id}`)
      return response.data;
    } catch (error) {
      console.error('No se puedo obtener datos del usuario', error)
    }
  }

  async obtenerTodosLasIndicaciones(userId: number) {
    try {
      const response = await axios.get(`${this.indUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('No se pudo obtener las indicaciones: ', error);
      throw error;
    }
  }

  async crearNuevaIndicacion(nuevaIndicacion: any) {
    try {
      const response = await axios.post(this.indUrl, nuevaIndicacion);
      console.log('Respuesta de Axios:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear la indicación:', error);
      throw error;
    }
  }

  async eliminarIndicacion(id: number, userId: number) {
    try {
      const response = await axios.delete(`${this.indUrl}/${userId}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la indicación:', error);
      throw new Error('Error al eliminar la indicación');
    }
  }
}