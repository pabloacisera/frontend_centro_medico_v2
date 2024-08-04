import { Component, OnInit } from '@angular/core';
import { VerTurnosAdminService } from './ver-turnos-admin.service';
import { Turnos } from '../../sistema-turnos/sistema-turnos.component';

@Component({
  selector: 'app-ver-turnos-admin',
  templateUrl: './ver-turnos-admin.component.html',
  styleUrls: ['./ver-turnos-admin.component.css']
})
export class VerTurnosAdminComponent implements OnInit {

  datosDeTurnos: Turnos[] = [];
  datosDeClientesEncontrados: { [id: number]: any } = {};
  datosDeUsuariosEncontrados: { [id: number]: any } = {};

  constructor(private verTurnosService: VerTurnosAdminService) { }

  ngOnInit() {
    this.obtenerTodosLosTurnos();
  }

  obtenerTodosLosTurnos() {
    this.verTurnosService.obtenerTodosLosTurnos().subscribe({
      next: response => {
        this.datosDeTurnos = response;
        const clienteIds = Array.from(new Set(response.map(turno => turno.clienteId)));
        const usuarioIds = Array.from(new Set(response.map(turno => turno.userId)));

        // Obtener datos de clientes y usuarios
        clienteIds.forEach(id => this.obtenerDatosDeClientes(id));
        usuarioIds.forEach(id => this.obtenerDatosDeUsuarios(id));
      },
      error: error => {
        console.error('Error al obtener los turnos:', error);
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
}
