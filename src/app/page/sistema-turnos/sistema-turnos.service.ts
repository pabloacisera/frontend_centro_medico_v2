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
  private apiUrlPresenciaCliente = environment.urlCliente;
  private urlCliente = environment.urlCliente;

  constructor() {}

  crearTurno(turno: Turnos): Observable<any> {
    return from(axios.post(this.apiUrl, turno).then(response => response.data));
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
}



