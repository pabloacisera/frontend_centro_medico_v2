import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class RegistroProfesionalService {

  url = environment.urlUsuario

  constructor(private http: HttpClient) { }

  registrar(data: any) {
    return this.http.post<any>(this.url, data)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar usuario:', error);
          return throwError(error); // Lanza el error para ser manejado por el componente
        })
      );
  }
}