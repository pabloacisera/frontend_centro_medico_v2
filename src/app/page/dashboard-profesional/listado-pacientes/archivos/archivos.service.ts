import { Injectable } from '@angular/core';
import axios from 'axios';
import { from, Observable } from 'rxjs';
import { environment } from '../../../../../environment/development';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  public urlDocs = environment.urlFile

  constructor(
    private toastr: ToastrService
  ) { }

  traerDocsById(idCliente: number): Observable<any> {
    return from(axios.get(`${this.urlDocs}/${idCliente}`));
  }

  downloadDocument(file: { id: number, filename: string }): void {
    axios.get(`${this.urlDocs}/download/${file.id}`, { responseType: 'blob' })
      .then(response => {
        saveAs(response.data, file.filename);
      })
      .catch(error => {
        console.error('Error descargando el archivo:', error);
      });
  }  

  removeDocbyId(id: number): Observable<any> {
    return from(axios.delete(`${this.urlDocs}/${id}`));
  }
}
