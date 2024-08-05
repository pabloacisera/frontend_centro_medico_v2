import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import axios from 'axios';
import { Cliente, Turnos, Usuario } from './sistema-turnos.component';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SistemaTurnosService {

  private baseUrl = environment.apiBaseUrl;
  private apiUrl = environment.urlTurnos;
  private apiUsuarioUrl = environment.urlUsuario;
  private urlCliente = environment.urlCliente;

  constructor() { }

  crearTurno(turno: Turnos): Observable<any> {
    return from(axios.post(this.apiUrl, turno, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.data));
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return from(axios.get(this.apiUsuarioUrl).then(response => response.data as Usuario[]));
  }

  borrarTurno(id: number): Observable<any> {
    return from(axios.delete(`${this.apiUrl}/${id}`).then(response => response.data));
  }

  buscarClientesByIdUsuario(userId: number): Promise<Cliente[]> {
    return axios.get<Cliente[]>(`${this.urlCliente}?userId=${userId}`).then(response => response.data);
  }

  notificarTurnoPorEmail(emailData: { turno: Turnos, clienteEmail: string, clienteNombre: string, profesionalNombre: string, fechaTurno: string }): Observable<void> {
    return from(
      axios.post(`${this.baseUrl}/mail/notificar-turno`, emailData)
        .then(() => {})
        .catch(err => {
          console.error('Error al enviar notificación de turno por correo: ', err);
          throw err;
        })
    );
  }
}



