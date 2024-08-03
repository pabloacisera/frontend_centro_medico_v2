import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class NomenclaturaService {

  private url = environment.urlNomenclatura

  constructor() { }

  async buscarNomenByCodigo(codigo: number){
    try {
      const response = await axios.get(`${this.url}/${codigo}`)
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('No se ha podido encontrar el codigo solicitado: ', error)
    }
  }

  async traerTodos(){
    try {
      const response = await axios.get(this.url);
      console.log('Datos de axios: ', response.data)
      return response.data; // Devuelve los datos obtenidos
    } catch (error) {
      console.error('Error al obtener codigos', error);
      throw error; // Propaga el error hacia arriba
    }
  }
}