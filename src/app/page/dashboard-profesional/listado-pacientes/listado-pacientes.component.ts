import { Component, OnInit } from '@angular/core';
import { ListadoPacientesService } from './listado-pacientes.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DateFormatPipe } from '../../../date-format.pipe';
import { SharedModule } from './shared.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-pacientes',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, ButtonModule, TableModule, DateFormatPipe,
    SharedModule, ProgressSpinnerModule
  ],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.css'
})
export class ListadoPacientesComponent implements OnInit {
  userId!: number;
  clienteId!: number;
  datosDeCliente: any[] = [];
  filtroDeBusqueda: any = { busquedaNombre: '' };
  p: number = 1;
  order: string = 'protocolo';
  reversa: boolean = true;
  Loading: boolean = false;
  first: number = 0;
  rows: number = 5;

  constructor(private readonly servicio: ListadoPacientesService, private route: ActivatedRoute,
    private ruta: Router, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
      this.obtenerClientPorId(this.userId);
    } else {
      console.error('No se encontró userData en el localStorage');
    }
  }

  async obtenerClientPorId(userId: number): Promise<void> {
    try {
      this.Loading = true;
      const response = await this.servicio.obtenerClientesById(userId);
      this.datosDeCliente = response;
      console.log(this.datosDeCliente);
      this.Loading = false;
    } catch (error) {
      console.error('No se ha podido obtener datos de clientes: ', error);
      this.Loading = false;
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  next() {
    this.first += this.rows;
  }

  prev() {
    this.first -= this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.datosDeCliente ? this.first === this.datosDeCliente.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.datosDeCliente ? this.first === 0 : true;
  }

  async funcionEliminarCliente(clienteId: number) {
    try {
      const response = await this.servicio.borrarClientePorId(clienteId, this.userId);
      console.log('Cliente borrado exitosamente: ', response);
      this.obtenerClientPorId(this.userId);
      this.toastr.warning('Se ha eliminado un registro', 'Actualizacion de base de datos')
    } catch (error) {
      console.error('Error al borrar cliente', error);
    }
  }

  setOrderBy(columna: string) {
    if (this.order === columna) {
      this.reversa = !this.reversa;
    } else {
      this.reversa = false;
    }
    this.order = columna;
  }

  nuevoPaciente(){
    this.ruta.navigate(['/nueva-ficha'])
  }
}