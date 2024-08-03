import { Injectable } from '@angular/core';
import axios from 'axios';
import { from, Observable } from 'rxjs';
import { Turnos } from '../page/sistema-turnos/sistema-turnos.component';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  private apiUrl = 'http://localhost:3000/api/v2/sist-turnos'

  constructor() { }

  obtenerTurno(): Observable<Turnos[]> {
    return from(axios.get(this.apiUrl).then(response => response.data));
  }

}
