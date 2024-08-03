import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/development';

@Injectable({
    providedIn: 'root'
})
export class LogeoProfesionalService {

    url = environment.urlUsuario

    constructor(private http: HttpClient) { }

    registrar(data: any) {
        return this.http.post<any>(`${this.url}/autenticacion`, data)
            .pipe(
                catchError((error) => {
                    console.error('Error al registrar usuario:', error);
                    return throwError(error); // Lanza el error para ser manejado por el componente
                })
            );
    }
}