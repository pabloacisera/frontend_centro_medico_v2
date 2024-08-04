import { Component, OnInit } from '@angular/core';
import { VerTurnosAdminService } from './ver-turnos-admin.service';
import { Turnos } from '../../sistema-turnos/sistema-turnos.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone:true,
  imports: [CommonModule, RouterLink],
  selector: 'app-ver-turnos-admin',
  templateUrl: './ver-turnos-admin.component.html',
  styleUrls: ['./ver-turnos-admin.component.css']
})
export class VerTurnosAdminComponent implements OnInit {

  datosDeTurnos: Turnos[] = [];
  datosDeClientesEncontrados: { [id: number]: any } = {};
  datosDeUsuariosEncontrados: { [id: number]: any } = {};
  isLoading:boolean = false;

  constructor(private verTurnosService: VerTurnosAdminService) { }

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
    const fechaString = fecha.toISOString().split('T')[0]; // Obtener solo la fecha
    const horaString = fecha.toISOString().split('T')[1].split('.')[0]; // Obtener solo la hora (sin milisegundos)
    return { fecha: fechaString, hora: horaString };
  }
}
