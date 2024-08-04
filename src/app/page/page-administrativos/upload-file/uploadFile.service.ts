import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/development';
import axios from "axios";
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  clienteUrl = environment.urlCliente;
  fileUrl = environment.urlFile;

  constructor() { }

  obtenerManyClientes(): Observable<any> {
    return from(axios.get(`${this.clienteUrl}`).then(response => response.data));
  }

  createFile(clienteId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return from(axios.post(`${this.fileUrl}/${clienteId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }));
  }  
}

