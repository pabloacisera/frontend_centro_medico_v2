import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NuevaFichaService } from '../../dashboard-profesional/nueva-ficha/nueva-ficha.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuarios } from './usuarios';
import { NuevoPacienteAdminService } from './nuevo-paciente-admin.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-nuevo-paciente',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './nuevo-paciente.component.html',
  styleUrls: ['./nuevo-paciente.component.css']
})
export class NuevoPacienteComponent implements OnInit {

  clienteForm: FormGroup;
  datosDeUsuarios: Usuarios[] = []
  userId: number | undefined;
  nombreProfesionalSeleccionado: string | undefined;
  opcionesSeguridadSocial = ['IAPOS', 'Pami', 'OSECAC', 'OSPRERA', 'Otras'];

  constructor(
    private fb: FormBuilder,
    private service: NuevaFichaService,
    private serviceAdmin: NuevoPacienteAdminService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.clienteForm = this.fb.group({
      protocolo: [''],
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      nacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      direccion: ['', Validators.required],
      localidad: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      seguridadSocial: ['', Validators.required],
      obs: [''],
      userId: [this.userId, Validators.required]
    });
  }

  ngOnInit(): void {
    this.recolectarFunciones()
  }

  recolectarFunciones(){
    this.obtenerTodosLosUsuarios()
  }

  async submitForm() {
    if (this.clienteForm.valid) {
      try {
        const clienteCreado = await this.service.nuevoCliente(this.clienteForm.value);
        console.log('Cliente creado:', clienteCreado);
        this.router.navigate(['/dashboard-admin']);
        this.toast.success('Se ha creado 1 nuevo paciente', 'Actualizacion de Base de datos:')
      } catch (error) {
        console.error('Error al crear cliente:', error);
      }
    } else {
      throw new Error('El formulario no es válido');
    }
  }

  calcularEdad() {
    const fechaNacimiento = this.clienteForm.get('nacimiento')?.value;

    if (fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      // Ajuste por si todavía no ha sido el cumpleaños este año
      if (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate())) {
        edad--;
      }

      this.clienteForm.patchValue({ edad: edad });
    }
  }

  async obtenerTodosLosUsuarios() {
    try {
      const response = await this.serviceAdmin.obtenerTodosLosUsuarios();
      this.datosDeUsuarios = response;
      console.log('Datos de usuario: ', this.datosDeUsuarios)
    } catch (error) {
      console.error('Error de frontend: ', error);
    }
  }

  onProfesionalChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    const profesionalSeleccionado = this.datosDeUsuarios.find(prof => prof.id === +selectedId);
    if (profesionalSeleccionado) {
      this.nombreProfesionalSeleccionado = profesionalSeleccionado.nombre;
      this.userId = profesionalSeleccionado.id;
      this.clienteForm.patchValue({ userId: this.userId });
    }
  }
  
}
