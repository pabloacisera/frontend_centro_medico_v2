import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class VerTurnosService {

  private turnoBaseUrl = environment.urlTurnos
  private clienteBaseUrl = environment.urlCliente

  constructor(private http: HttpClient) { }

  obtenerTurnoByUserId(userId: number): Promise<any> {
    return axios.get(`${this.turnoBaseUrl}/${userId}/mis_turnos`);
  }

  async getClientsByIds(ids: number[]): Promise<any[]> {
    try {
      const response = await axios.post(`${this.clienteBaseUrl}/find-by-ids`, { ids });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener clientes', error)
    }
  }

  async deleteClienteById(id: number) {
    try {
      const response = await axios.delete(`${this.turnoBaseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw new Error('Error al eliminar turno', error)
    }
  }
}

