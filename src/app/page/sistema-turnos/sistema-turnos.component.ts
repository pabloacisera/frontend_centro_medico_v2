import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaTurnosService } from './sistema-turnos.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule,
    TableModule,
    RouterLink,
  ],
  templateUrl: './sistema-turnos.component.html',
  styleUrls: ['./sistema-turnos.component.css'],
  providers: [DatePipe]
})
export class SistemaTurnosComponent implements OnInit {

  

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
    // Verificar que todos los campos necesarios estén presentes
    if (!this.fecha || !this.hora || !this.clientId || !this.userId) {
      this.toastr.warning('Por favor, complete todos los campos necesarios.');
      return;
    }

    // Crear el objeto turno
    const turno: Turnos = {
      fecha: `${this.fecha}T${this.hora}:00Z`,
      clienteId: this.clientId,
      userId: this.userId
    };

    console.log('Datos del turno a enviar:', turno);

    // Enviar los datos al servicio
    this.turnosService.crearTurno(turno).subscribe({
      next: data => {
        if (data.mensaje === 'Turno no disponible') {
          this.toastr.warning('Turno no disponible. Por favor, seleccione otra fecha.');
        } else {
          this.toastr.success('Turno creado exitosamente');

          /**si el turno se ha creado se debe enviar un mail */
          this.notificarTurnoPorEmail()
        }
      },
      error: err => {
        console.error('Error al crear Turno: ', err);
        this.toastr.warning('No se pudo crear el turno');
      }
    });
  }

  /**funcion para enviar mail */
  notificarTurnoPorEmail(): void {
    const cliente = this.clientes.find(cliente => cliente.id === this.clientId);
    const usuario = this.usuarios.find(usuario => usuario.id === this.userId);
  
    if (!cliente || !usuario) {
      this.toastr.error('No se encontraron datos del cliente o del profesional.');
      return;
    }
  
    const fechaTurno = this.datePipe.transform(this.fecha, 'dd/MM/yyyy') + ' ' + this.hora;
  
    const emailDataToSend = {
      turno: {
        fecha: `${this.fecha}T${this.hora}:00Z`,
        clienteId: this.clientId,
        userId: this.userId
      },
      clienteEmail: cliente.email,
      clienteNombre: cliente.nombre,
      profesionalNombre: usuario.nombre,
      fechaTurno: fechaTurno
    };
  
    this.turnosService.notificarTurnoPorEmail(emailDataToSend).subscribe({
      next: () => {
        this.toastr.success('Notificación de turno enviada por correo.');
      },
      error: err => {
        console.error('Error al enviar notificación de turno por correo: ', err);
        this.toastr.error('No se pudo enviar la notificación por correo.');
      }
    });
  }
  

  volver(): void {
    this.ruta.navigate(['/dashboard-admin']);
  }
}






