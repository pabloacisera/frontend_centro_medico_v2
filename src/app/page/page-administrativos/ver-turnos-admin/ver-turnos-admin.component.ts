import { Component, OnInit } from '@angular/core';
import { VerTurnosAdminService } from './ver-turnos-admin.service';
import { Turnos } from '../../sistema-turnos/sistema-turnos.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterPipe } from './filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone:true,
  imports: [CommonModule, RouterLink, FilterPipe, FormsModule, ReactiveFormsModule],
  selector: 'app-ver-turnos-admin',
  templateUrl: './ver-turnos-admin.component.html',
  styleUrls: ['./ver-turnos-admin.component.css']
})
export class VerTurnosAdminComponent implements OnInit {

  datosDeTurnos: Turnos[] = [];
  datosDeClientesEncontrados: { [id: number]: any } = {};
  datosDeUsuariosEncontrados: { [id: number]: any } = {};
  isLoading:boolean = false;
  searchTerm: string = '';

  constructor(
    private verTurnosService: VerTurnosAdminService,
    private toastr:ToastrService,
  ) { }

  ngOnInit() {
    this.obtenerTodosLosTurnos();
  }

  obtenerTodosLosTurnos() {
    this.isLoading = true
    this.verTurnosService.obtenerTodosLosTurnos().subscribe({
      next: response => {
        this.datosDeTurnos = response;
        const clienteIds = Array.from(new Set(response.map(turno => turno.clienteId)));
        const usuarioIds = Array.from(new Set(response.map(turno => turno.userId)));

        // Obtener datos de clientes y usuarios
        clienteIds.forEach(id => this.obtenerDatosDeClientes(id));
        usuarioIds.forEach(id => this.obtenerDatosDeUsuarios(id));
        this.isLoading = false
      },
      error: error => {
        console.error('Error al obtener los turnos:', error);
        this.isLoading = false
      }
    });
  }

  obtenerDatosDeClientes(id: number) {
    this.verTurnosService.obtenerClientesPorId(id).subscribe({
      next: cliente => {
        this.datosDeClientesEncontrados[id] = cliente;
      },
      error: error => {
        console.error('Error al obtener el cliente:', error);
      }
    });
  }

  obtenerDatosDeUsuarios(id: number) {
    this.verTurnosService.obtenerUsuariosPorId(id).subscribe({
      next: usuario => {
        this.datosDeUsuariosEncontrados[id] = usuario;
      },
      error: error => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }

  getClienteNombre(id: number): string {
    return this.datosDeClientesEncontrados[id]?.nombre || 'Desconocido';
  }

  getUsuarioNombre(id: number): string {
    return this.datosDeUsuariosEncontrados[id]?.nombre || 'Desconocido';
  }

  /**desestructura fecha */
  obtenerFechaYHora(fechaCompleta: string): { fecha: string, hora: string } {
    const fecha = new Date(fechaCompleta);
    const datePipe = new DatePipe('es-ES'); // Cambia el idioma si lo necesitas
  
    // Formatear la fecha en "1 de enero de 2000"
    const fechaString = datePipe.transform(fecha, 'd \'de\' MMMM \'de\' yyyy'); 
    // Formatear la hora en "HH:mm"
    const horaString = datePipe.transform(fecha, 'HH:mm'); 
  
    return { fecha: fechaString, hora: horaString };
  }

  borrarTurno(id: number) {
    this.verTurnosService.borrarTurnoPorId(id).subscribe({
      next: response => {
        this.toastr.warning('Se ha eliminado el turno de DB', 'Info')
      },
      error: err=> {
        this.toastr.error('No se ha podido cancelar turno', 'Info')
        throw new Error('No se ha podido borrar registro de DB: ', err)
      }
    })
  }
}
