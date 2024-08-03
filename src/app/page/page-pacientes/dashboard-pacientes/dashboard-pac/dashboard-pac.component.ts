import { Component, OnInit } from '@angular/core';
import { DateFormatPipe } from '../../../../date-format.pipe';
import { DashboardPacienteService } from './dashboard-paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';


/**interface de objeto para localStorage */
interface DatosCliente {
  createdAt: string;
  direccion: string;
  edad: number;
  email: string;
  id: number;
  localidad: string;
  nacimiento: string;
  nombre: string;
  obs: string;
  protocolo: number;
  seguridadSocial: string;
  telefono: string;
  userId: number;
}

interface DatosDeUsuario{
  rol: string,
  area: string,
  email: string,
  nombre: string,
}

interface ResultadoEstudio {
  codigo: number;
  determinacion: string;
  resultado: string;
  unidadBase: string;
  valorTotal: number;
}

interface Indicacion {
  titulo: string; 
  texto: string; 
}

/******************************************** */

@Component({
  standalone: true,
  selector: 'app-dashboard-pac',
  imports: [DateFormatPipe, CommonModule, FormsModule, ReactiveFormsModule, TabViewModule],
  templateUrl: './dashboard-pac.component.html',
  styleUrls: ['./dashboard-pac.component.css'],
})
export class DashboardPacComponent implements OnInit { 

  userId: number = 0
  clientId: number = 0
  datosUsuarioById: DatosDeUsuario | null = null;
  indicaciones: Indicacion[] = [];
  resultados: ResultadoEstudio[] = [];
  isLoading: boolean = false;
  valorSumar: number = 0
  valorTotal: number = 0

  datosObtenidoDeLocalStorage: DatosCliente | null = null

  constructor(private readonly service: DashboardPacienteService,
    private route: Router
  ) { }

  ngOnInit() {
    this.recolectarFunciones()
  }

  recolectarFunciones() {
    this.extraerDatosLS()
    this.obtenerProfesional(this.userId)
    this.obtenerIndicaciones(this.userId)
    this.obtenerResultados(this.clientId)
  }

  extraerDatosLS() {
    const datosJson = localStorage.getItem('userData');

    if (datosJson) {
      this.datosObtenidoDeLocalStorage = JSON.parse(datosJson)
      console.log('Datos extraidos de localStorage: ', this.datosObtenidoDeLocalStorage)
      this.userId = this.datosObtenidoDeLocalStorage.userId;
      console.log('User ID: ', this.userId);
      this.clientId = this.datosObtenidoDeLocalStorage.id;
      console.log('Cliente id: ', this.clientId)
    }

  }

  async obtenerProfesional(userId: number){
    try {
      const response = await this.service.obtenerUsuarioById(userId)
      this.datosUsuarioById = response
      console.log(this.datosUsuarioById)
    } catch (error) {
      console.log(error)
    }
  }

  async obtenerIndicaciones(userId: number){
    try {
      const response = await this.service.obtenerTodosLasIndicaciones(userId)
      this.indicaciones = response
      console.log(this.indicaciones)
    } catch (error) {
      console.log(error)
    }
  }

  sumarValorTotal() {
    this.valorSumar = this.resultados.reduce((acc, item) => acc + item.valorTotal, 0);
  }

  async obtenerResultados(clienteId?: number) {
    try {
      this.isLoading = true;
      this.resultados = await this.service.findAllResultados(clienteId);
      console.log('Resutlados por id', this.resultados)
      this.sumarValorTotal();
      this.isLoading = false;
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      // Manejar el error según sea necesario (por ejemplo, mostrar un mensaje de error en la UI)
      this.isLoading = false;
    }
  }

  salir(){
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    this.route.navigate(['home'])
  }
}
