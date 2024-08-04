import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import axios from 'axios';
import { Cliente, Turnos, Usuario } from './sistema-turnos.component';
import { environment } from '../../../environment/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class SistemaTurnosService {

  private baseUrl = environment.apiBaseUrl
  private apiUrl = environment.urlTurnos
  private apiUsuarioUrl = environment.urlUsuario
  private apiUrlPresenciaCliente = environment.urlCliente
  private urlCliente = environment.urlCliente
  private urlTurno = environment.urlTurnos

  constructor() { }

  crearTurno(turno: Turnos): Observable<any> {
    return from(axios.post(this.apiUrl, turno).then(response => response.data));
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return from(axios.get(this.apiUsuarioUrl).then(response => response.data as Usuario[]));
  }

  borrarTurno(id: number) {
    return from(axios.delete(`${this.apiUrl}/${id}`).then(response => response.data));
  }

  notificarTurnoPorEmail(emailData: { turno: Turnos, clienteEmail: string, clienteNombre: string, fechaTurno: string }) {
    const { turno, clienteEmail, clienteNombre, fechaTurno } = emailData;

    const emailDataToSend = {
      to: clienteEmail,
      clienteNombre: clienteNombre,
      fechaTurno: fechaTurno,
      subject: 'Confirmación de Turno',
      text: `Estimado/a ${clienteNombre},\n\nEste es un recordatorio de que tiene un turno programado para el ${fechaTurno}. Por favor, no falte.\n\nSaludos cordiales,\nAdministración.`
    };

    return from(axios.post(`${this.urlTurno}/notificar-turno`, emailDataToSend).then(() => { }));
  }

  async buscarClientesByIdUsuario(userId: number): Promise<Cliente[]> {
    try {
      const response = await axios.get<Cliente[]>(`${this.urlCliente}?userId=${userId}`);
      console.log('Respuesta de axios: ', response)
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes por ID de usuario:', error);
      throw error;
    }
  }
}


