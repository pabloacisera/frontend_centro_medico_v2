import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarService } from './editar.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-paciente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit {
  userId!: number;
  clienteId!: number;
  datosDeCliente: any = {};
  formularioDeActualizacion: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private peticion: EditarService,
    private fb: FormBuilder,
    private ruta: Router,
    private toatr: ToastrService
  ) {
    this.formularioDeActualizacion = this.fb.group({
      protocolo: [''],
      nombre: [''],
      dni: [''],
      nacimiento: [''],
      edad: [''],
      direccion: [''],
      localidad: [''],
      telefono: [''],
      email: [''],
      seguridadSocial: [''],
      obs: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerDatosUsuario();
    this.obtenerDatosCliente();
    this.recolectarDatos();
  }

  obtenerDatosUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
    }
  }

  obtenerDatosCliente() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = parseInt(idParam, 10);
    }
  }

  async recolectarDatos() {
    await this.obtenerClientePorId(this.clienteId, this.userId);
    this.cargarDatosFormulario();
  }

  async obtenerClientePorId(clienteId: number, userId: number) {
    try {
      const response = await this.peticion.encontrarClienteById(clienteId, userId);
      this.datosDeCliente = response;
    } catch (error) {
      console.error('Error en .ts: ', error);
    }
  }

  cargarDatosFormulario() {
    this.formularioDeActualizacion.patchValue({
      protocolo: this.datosDeCliente.protocolo,
      nombre: this.datosDeCliente.nombre,
      dni: this.datosDeCliente.dni,
      nacimiento: this.datosDeCliente.nacimiento,
      edad: this.datosDeCliente.edad,
      direccion: this.datosDeCliente.direccion,
      localidad: this.datosDeCliente.localidad,
      telefono: this.datosDeCliente.telefono,
      email: this.datosDeCliente.email,
      seguridadSocial: this.datosDeCliente.seguridadSocial,
      obs: this.datosDeCliente.obs
    });
  }

  calcularEdad() {
    const fechaNacimiento = this.formularioDeActualizacion.get('nacimiento')?.value;

    if (fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      // Ajuste por si todavía no ha sido el cumpleaños este año
      if (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate())) {
        edad--;
      }

      this.formularioDeActualizacion.patchValue({ edad: edad });
    }
  }

  async submitForm() {
    try {
      const response = await this.peticion.ActualizarDatosCliente(this.clienteId, this.formularioDeActualizacion.value, this.userId);
      console.log('Cliente actualizado exitosamente');
      this.toatr.success(`Se ha actualizado el registro con identificador: ${this.clienteId}`, 'Actualizacion de base de datos')
      this.ruta.navigate([`/ver/${this.clienteId}`])
    } catch (error) {
      console.error('Error al actualizar cliente', error);
    }
  }
}
