import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class CargarService {

  url = environment.urlCliente
  urlresultado =  environment.urlResultado

  constructor() { }

  async encontrarClienteById(clienteId: number, userId: number){
    try {
      const response = await axios.get(`${this.url}/${clienteId}`, {
        params: {
          userId: userId,
        }
      })
      return response.data;
    } catch (error) {
      console.error('Error al obtener cliente: ', error)
    }
  }

  async eliminarResultadoPorId(id: number) {
    try {
      const response = await axios.delete(`${this.urlresultado}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el resultado:', error);
      throw new Error(`Error al eliminar el resultado`);
    }
  }

  async findAllResultados(clienteId?: number) {
    try {
      const url = clienteId ? `${this.urlresultado}?clienteId=${clienteId}` : `${this.urlresultado}`;
      const response = await axios.get(url); // Ajusta Resultado según la estructura real
      return response.data;
    } catch (error) {
      console.error('Error fetching resultados:', error);
      throw new Error(`Error al obtener los resultados`);
    }
  }
}