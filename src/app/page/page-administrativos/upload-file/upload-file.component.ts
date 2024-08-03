import { Component, OnInit } from '@angular/core';
import { UploadFileService } from './uploadFile.service';
import { UploadFilePipe } from '../upload-file.pipe';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-upload-file',
  imports: [
    UploadFilePipe,
    CommonModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    FileUploadModule,
    RouterLink
  ],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  public clientes = [];
  public isLoading: boolean = false;
  id_cliente: number = 0;
  public page: number = 0;
  public nombre: string = '';
  public text: string = '';
  file: File | null = null;
  success: boolean = false;
  error: boolean = false;
  message: string = '';

  constructor(
    private readonly service: UploadFileService,
    private readonly route: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.recolectarMetodos();
  }

  recolectarMetodos() {
    this.obtenerTodosLosClientes();
  }

  obtenerTodosLosClientes() {
    this.isLoading = true;
    this.service.obtenerManyClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener clientes', error);
        this.isLoading = false;
      }
    });
  }

  capturarId(id: number) {
    this.id_cliente = id;
    this.obtenerNombrePorId(this.id_cliente);
  }

  obtenerNombrePorId(id_cliente: number) {
    const cliente = this.clientes.find(cliente => cliente.id === id_cliente);
    if (cliente) {
      this.nombre = cliente.nombre;
    } else {
      console.error("Cliente no encontrado");
    }
  }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if (this.page > 0) {
      this.page -= 5;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  searchTerm(text: string) {
    this.text = text;
    console.log('Palabra para buscar:', this.text);
  }

  cargarDoc(): void {
    if (!this.file) {
      this.message = 'Por favor, selecciona un archivo.';
      this.error = true;
      return;
    }

    this.service.createFile(this.id_cliente, this.file).subscribe({
      next: (response) => {
        this.success = true;
        this.error = false;
        this.message = 'Archivo guardado correctamente.';
        console.log(response);
        this.toastr.success('Se ha cargado 1 archivo exitosamente', 'Actualizacion:')
        this.route.navigate(['/dashboard-admin'])
      },
      error: (err) => {
        console.error('Error al guardar el archivo:', err);
        this.success = false;
        this.error = true;
        this.message = 'Error al guardar el archivo: ' + (err.response?.data?.message || 'Error desconocido');
        this.toastr.warning('Se ha producido un error al intentar guardar archivo', 'Actualizacion:')
      }
    });
  }
}