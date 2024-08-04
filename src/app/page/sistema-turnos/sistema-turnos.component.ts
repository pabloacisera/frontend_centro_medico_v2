import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaTurnosService } from './sistema-turnos.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Socket } from 'ngx-socket-io';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { AvisoPresenciaComponent } from '../../aviso-presencia/aviso-presencia.component';
import { NotificationService } from '../../aviso-presencia/notificacion-global.service';

export interface Turnos {
  id?: number;
  fecha: string; // Fecha en formato ISO
  clienteId: number;
  userId: number;
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
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
  filteredTurnos: Turnos[] = [];
  first: number = 0;
  rows: number = 16;
  clienteIdSeleccionado: number | null = null;
  clienteId: number = 0
  sortedTurnos: any[] = [];
  sortOrder: number = 1; // 1 para ascendente, -1 para descendente
  sortField: string = '';
  respuestaSocket: Subscription


  constructor(private turnosService: SistemaTurnosService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private ruta: Router,
    private socket: Socket,
    private webSocketService: WebsocketService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.recolectarFuncionesYMetodos()
  }

  recolectarFuncionesYMetodos() {
    this.obtenerUsuarios();
    this.sortedTurnos = [...this.turnos];
    this.capturarRespuestaSocket()
  }

  /**paginador */
  onPageChange(event: PaginatorState) {
    this.first = event.first;
    this.rows = event.rows;
  }
  /************/


  /**seleccionar usuarios para buscar pacientes */
  obtenerUsuarios(): void {
    this.turnosService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('Datos del usuario: ', this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }

  onUsuarioSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const userId = selectElement.value;
    if (userId) {
      this.obtenerClientes(Number(userId));
    }
  }

  async obtenerClientes(userId: number): Promise<void> {
    try {
      this.clientes = await this.turnosService.buscarClientesByIdUsuario(userId);
      console.log('Pacientes del profesional: ', this.clientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  }

  /************************************************/

  crearTurno(fechaStr: string, clienteIdStr: string, userIdStr: string): void {
    const fecha = new Date(fechaStr).toISOString();
    const clienteId = parseInt(clienteIdStr, 10);
    const userId = parseInt(userIdStr, 10);

    if (isNaN(clienteId) || isNaN(userId)) {
      this.mensaje = 'Datos inválidos. Por favor, verifique los campos.';
      this.ocultarMensaje();
      return;
    }

    // Crear el turno
    this.turnosService.crearTurno({ fecha, clienteId, userId }).subscribe({
      next: (nuevoTurno) => {
        this.turnos.push(nuevoTurno);
        this.toastr.success('Se ha creado un nuevo turno', 'Actualización de turno');
        this.mensaje = 'Turno creado exitosamente.';
        //this.obtenerTurnos()
        this.ocultarMensaje();

        // Obtener cliente y usuario para la notificación
        const cliente = this.clientes.find(c => c.id === clienteId);
        const usuario = this.usuarios.find(u => u.id === userId);

        const formattedFechaTurno = format(new Date(fecha), 'dd/MM/yyyy HH:mm');

        if (cliente && usuario) {
          // Enviar notificación por email
          const emailData = {
            turno: nuevoTurno,
            clienteEmail: cliente.email,
            clienteNombre: cliente.nombre, // Asegúrate de enviar el nombre del cliente
            fechaTurno: formattedFechaTurno
          };

          this.turnosService.notificarTurnoPorEmail(emailData).subscribe({
            next: () => {
              console.log('Correo electrónico enviado exitosamente.');
            },
            error: (error) => {
              console.error('Error al enviar el correo electrónico', error);
            }
          });
        } else {
          console.warn('Cliente o usuario no encontrado para la notificación.');
        }
      },
      error: (error) => {
        this.mensaje = 'Error al crear el turno, el mismo ya se encuentra ocupado. Inténtelo de nuevo, con una fecha u hora diferente';
        this.ocultarMensaje();
      }
    });
  }


  /**notificar turno por email */
  notificarTurnoPorEmail() { }

  /**ocultar mensaje */
  ocultarMensaje(): void {
    setTimeout(() => {
      this.mensaje = '';
    }, 5000);
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  /*******************Macar presentcia*************************** */

  seleccionarPaciente(clienteId: number): void {
    const cliente = this.clientes.find(c => c.id === clienteId);
    if (cliente) {
      this.webSocketService.sendNombrePaciente(cliente.nombre);
    } else {
      console.error('Cliente no encontrado.');
    }
  }  

  
  capturarRespuestaSocket() {
    this.respuestaSocket = this.webSocketService.mensajeEvent().subscribe((data)=> {
      console.log('Respuesta del socket', data)
      const message = `El paciente ${data} se encuentra presente en el establecimiento`;
      this.notification.showMessage(message);
      this.notificationService.notify(message);
    })
  }
  
  /*********************ordenar tabla*************************************** */

  sortData(field: string) {
    this.sortOrder = this.sortField === field ? -this.sortOrder : 1;
    this.sortField = field;
    this.sortedTurnos = this.sortedTurnos.sort((a, b) => {
      let valueA = this.getFieldValue(a, field);
      let valueB = this.getFieldValue(b, field);
      return (valueA < valueB ? -1 : 1) * this.sortOrder;
    });
  }

  getClienteNombre(clienteId: number): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Desconocido';
  }

  getFieldValue(item: any, field: string) {
    switch (field) {
      case 'fecha': return new Date(item.fecha).getTime();
      case 'clienteId': return this.getClienteNombre(item.clienteId).toLowerCase();
      case 'userId': return this.getUsuarioNombre(item.userId).toLowerCase();
      default: return '';
    }
  }

  /**************************filtros de tabla**********************************/


  // Dentro de la clase SistemaTurnosComponent

  // Aplicar filtro por mes
  filterByMonth(event: Event): void {
    const input = event.target as HTMLInputElement;
    const month = input.value;

    if (month) {
      this.sortedTurnos = this.turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha);
        const turnoMonth = turnoDate.toISOString().slice(0, 7);
        return turnoMonth === month;
      });
    } else {
      this.sortedTurnos = [...this.turnos]; // Restablecer a todos los turnos
    }
  }

  // Aplicar filtro por día
  filterByDay(event: Event): void {
    const input = event.target as HTMLInputElement;
    const day = input.value;

    if (day) {
      this.sortedTurnos = this.turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha).toISOString().split('T')[0];
        return turnoDate === day;
      });
    } else {
      this.sortedTurnos = [...this.turnos]; // Restablecer a todos los turnos
    }
  }


  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  cancelarPorId(id: number) {
    console.log('Id para cancelar: ', id);
    try {
      const res = this.turnosService.borrarTurno(id);
      this.toastr.warning('Se ha cancelado un turno', 'Actualizacion de turno');
    } catch (error) {
      console.log(error)
    }
  }

  volver() {
    this.ruta.navigate(['/dashboard-admin'])
  }

  //faltan obtener los turnos
}




