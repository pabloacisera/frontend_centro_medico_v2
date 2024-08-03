// ver-turnos.component.ts
import { Component, OnInit } from '@angular/core';
import { VerTurnosService } from './ver-turnos.service';
import { CommonModule } from '@angular/common';
import { DateTimeFormatPipe } from '../../date-fns.pipe';
import { RouterLink } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  standalone: true,
  imports: [CommonModule, DateTimeFormatPipe, RouterLink],
  selector: 'app-ver-turnos',
  templateUrl: './ver-turnos.component.html',
  styleUrls: ['./ver-turnos.component.css']
})
export class VerTurnosComponent implements OnInit {

  turnosEncontrados: any[] = [];
  datosDeClientes: any[] = [];
  userId: number = 0;
  clientesIds: number[] = [];
  isLoading: boolean = false;

  constructor(private readonly turnoService: VerTurnosService) { }

  ngOnInit() {
    this.extraerIdDeUsuarioLS();
    this.obtenerTurnoPorIdDeUsuario(this.userId);
  }
  
  extraerIdDeUsuarioLS() {
    const data = localStorage.getItem('userData');
    if (data) {
      const extraerId = JSON.parse(data);
      this.userId = extraerId.id;
    }
  }

  async obtenerTurnoPorIdDeUsuario(userId: number) {
    this.isLoading = true;
    try {
      const response = await this.turnoService.obtenerTurnoByUserId(userId);
      console.log('Estos son los turnos del usuario: ', response.data);
      this.turnosEncontrados = response.data;

      // Extraer ids de cliente de todos los turnos y buscar detalles de cada cliente en paralelo
      this.clientesIds = this.turnosEncontrados.map(turno => turno.clienteId);
      console.log('Ids de clientes: ', this.clientesIds);
     
      // Llamar a la función para obtener los clientes
      await this.getClients(this.clientesIds);

      console.log('Detalles de los clientes:', this.datosDeClientes);
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async getClients(clientesIds: number[]): Promise<void> {
    try {
      const response = await this.turnoService.getClientsByIds(clientesIds);
      this.datosDeClientes = response;
      console.log('Detalles de los clientes:', this.datosDeClientes);
    } catch (error) {
      console.error('Error al obtener los detalles de los clientes:', error);
    }
  }

  async eliminarTurno(id: number) {
    try {
      const response = await this.turnoService.deleteClienteById(id)
      this.obtenerTurnoPorIdDeUsuario(this.userId)
      return response;
    } catch (error) {
      throw new Error('Erros al eliminar turno', error)
    }
  }

  async actualizarTurnos() {
    return await this.obtenerTurnoPorIdDeUsuario(this.userId);
  }
}


