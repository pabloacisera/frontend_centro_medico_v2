import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NuevaFichaService } from './nueva-ficha.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nueva-ficha',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './nueva-ficha.component.html',
  styleUrl: './nueva-ficha.component.css'
})
export class NuevaFichaComponent {
  clienteForm: FormGroup;
  userId: number | undefined;
  opcionesSeguridadSocial = ['IAPOS', 'Pami', 'OSECAC', 'OSPRERA', 'Otras'];

  constructor(
    private fb: FormBuilder,
    private service: NuevaFichaService,
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
    const userData = localStorage.getItem('userData');

    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
      this.clienteForm.patchValue({ userId: this.userId });
    }
  }

  async submitForm() {
    if (this.clienteForm.valid) {
      try {
        const clienteCreado = await this.service.nuevoCliente(this.clienteForm.value);
        console.log('Cliente creado:', clienteCreado);
        this.router.navigate(['/listado-pacientes']);
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
}
