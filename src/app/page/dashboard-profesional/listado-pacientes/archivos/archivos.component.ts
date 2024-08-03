import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArchivosService } from './archivos.service';
import { CommonModule } from '@angular/common';


interface File {
  id: number;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  public clienteId: number = 0
  public files: File[] = [];
  public message: string = ''

  constructor(
    private route: ActivatedRoute,
    private docService: ArchivosService,
  ) { }

  ngOnInit() {
    this.recolectarMetodos()
  }

  verificarExistenciaDeArchivos() {
    if (this.files.length > 0) {
      this.message = '';
    } else {
      this.message = 'No hay archivos cargados que correspondan al paciente'; // Mostrar mensaje si no hay archivos
    }
  }

  recolectarMetodos() {
    this.obtenerIdDeCliente()
    this.obtenerDocsDelCliente(this.clienteId)
  }

  obtenerIdDeCliente() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = parseInt(idParam, 10);
      console.log('Id del cliente: ', this.clienteId);
    }
  }

  obtenerDocsDelCliente(id: number) {
    this.docService.traerDocsById(this.clienteId).subscribe({
      next: (response) => {
        this.files = response.data.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt)
        }));
        console.log('Documentos: ', this.files);
        this.verificarExistenciaDeArchivos();
      },
      error: (err) => {
        console.error('Error al cargar los archivos: ', err);
      }
    });
  }

  /**fomateo de fecha */

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  /**download document */
  downloadDocument(file: { id: number, filename: string }) {
    this.docService.downloadDocument(file);
  }

  /**delete document */
  eliminarDocumento(id: number) {
    this.docService.removeDocbyId(id).subscribe({
      next: () => {
        console.log('Documento eliminado con éxito');
        // Actualiza la lista de archivos después de la eliminación
        this.obtenerDocsDelCliente(this.clienteId);
      },
      error: (err) => {
        console.error('Error al eliminar el documento:', err);
      }
    });
  } 
}


