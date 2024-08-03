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
  private apiClienteUrl = environment.urlCliente
  private apiUrlPresenciaCliente = environment.urlCliente
  private privateUrlTurno = environment.mailServiceUrl

  constructor() { }

  crearTurno(turno: Turnos): Observable<any> {
    return from(axios.post(this.apiUrl, turno).then(response => response.data));
  }

  obtenerTurno(): Observable<Turnos[]> {
    return from(axios.get(this.apiUrl).then(response => response.data));
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return from(axios.get(this.apiUsuarioUrl).then(response => response.data as Usuario[]));
  }

  obtenerClientes(): Observable<Cliente[]> {
    return from(axios.get(`${this.apiClienteUrl}/forAdmin`).then(response => response.data as Cliente[]));
  }

  borrarTurno(id: number) {
    return from(axios.delete(`${this.apiUrl}/${id}`).then(response => response.data));
  }

  notificarTurnoPorEmail(emailData: { turno: Turnos, clienteEmail: string, clienteNombre: string, fechaTurno: string }): Observable<void> {
    const { turno, clienteEmail, clienteNombre, fechaTurno } = emailData;

    const emailDataToSend = {
      to: clienteEmail,
      clienteNombre: clienteNombre,
      fechaTurno: fechaTurno,
      subject: 'Confirmación de Turno',
      text: `Estimado/a ${clienteNombre},\n\nEste es un recordatorio de que tiene un turno programado para el ${fechaTurno}. Por favor, no falte.\n\nSaludos cordiales,\nAdministración.`
    };

    return from(axios.post(`${this.privateUrlTurno}/notificar-turno`, emailDataToSend).then(() => { }));
  }
}


