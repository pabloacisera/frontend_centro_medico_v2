import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { from, Observable } from 'rxjs';
import axios from 'axios';
import { Turnos } from '../../sistema-turnos/sistema-turnos.component';

@Injectable({
  providedIn: 'root'
})
export class VerTurnosAdminService {

  private urlTurnos = environment.urlTurnos;
  private urlCliente = environment.urlCliente;
  private urlUsuario = environment.urlUsuario;

  /**emitters */
  @Output() disparadorDeNotificaciones: EventEmitter<{ nombreCliente: string }> = new EventEmitter();

  constructor() { }

  obtenerTodosLosTurnos(): Observable<Turnos[]> {
    return from(axios.get<Turnos[]>(this.urlTurnos).then(response => response.data));
  }

  obtenerClientesPorId(id: number): Observable<any> {
    return from(axios.get(`${this.urlCliente}/${id}`).then(response => response.data));
  }

  obtenerUsuariosPorId(id: number): Observable<any> {
    return from(axios.get(`${this.urlUsuario}/${id}`).then(response => response.data));
  }

  borrarTurnoPorId(id: number): Observable<any> {
    return from(axios.delete(`${this.urlTurnos}/${id}`).then(response => response.data));
  }  
}
