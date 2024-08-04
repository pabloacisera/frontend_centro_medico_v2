import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaTurnosService } from './sistema-turnos.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AvisoPresenciaComponent } from '../../aviso-presencia/aviso-presencia.component';
import { NotificationService } from '../../aviso-presencia/notificacion-global.service';

export interface Turnos {
  id?: number;
  fecha: string; // Fecha en formato ISO
  clienteId: number;
  userId: number;
}

export interface Usuario {
  id: number;
  nombre: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

@Component({
  standalone: true,
  selector: 'app-sistema-turnos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaginatorModule, TableModule, AvisoPresenciaComponent],
  templateUrl: './sistema-turnos.component.html',
  styleUrls: ['./sistema-turnos.component.css'],
  providers: [DatePipe]
})
export class SistemaTurnosComponent implements OnInit {

  @ViewChild(AvisoPresenciaComponent) notification: AvisoPresenciaComponent;

  turnos: Turnos[] = [];
  usuarios: Usuario[] = [];
  clientes: Cliente[] = [];
  mensaje: string = '';
  isLoading: boolean = false;
  respuestaSocket: Subscription;
  userId: number = 0;
  clientId: number = 0;
  fecha: string = '';
  hora: string = '';

  constructor(
    private turnosService: SistemaTurnosService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private ruta: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.turnosService.obtenerUsuarios().subscribe({
      next: data => {
        this.usuarios = data;
      },
      error: err => {
        console.error('Error al obtener usuarios:', err);
        this.toastr.error('No se pudieron obtener los usuarios.');
      }
    });
  }

  seleccionarUsuario(id: number): void {
    this.userId = id;
    this.buscarClientesById(this.userId);
  }

  buscarClientesById(userId: number): void {
    this.turnosService.buscarClientesByIdUsuario(userId).then(
      data => {
        this.clientes = data;
      },
      err => {
        console.error('Error al obtener clientes:', err);
        this.toastr.error('No se pudieron obtener los clientes.');
      }
    );
  }

  seleccionarPaciente(id: number): void {
    this.clientId = id;
    console.log('ID del cliente seleccionado:', this.clientId);
  }

  crearTurno(): void {
    const turno: Turnos = {
      fecha: `${this.fecha}T${this.hora}:00Z`,
      clienteId: this.clientId,
      userId: this.userId
    };
  
    this.turnosService.crearTurno(turno).subscribe({
      next: data => {
        if (data.mensaje === 'Turno no disponible') {
          this.toastr.warning('Turno no disponible. Por favor, seleccione otra fecha.');
        } else {
          this.toastr.success('Turno creado exitosamente');
        }
      },
      error: err => {
        console.error('Error al crear Turno: ', err);
        this.toastr.warning('No se pudo crear el turno');
      }
    });
  }
  


  volver(): void {
    this.ruta.navigate(['/dashboard-admin']);
  }
}




