import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NuevaContraseñaAdminService } from './nueva-contraseña.service';

@Component({
  standalone: true,
  selector: 'app-nueva-contraseña',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './nueva-contraseña.component.html',
  styleUrls: ['./nueva-contraseña.component.css']
})
export class NuevaContraseñaAdminComponent implements OnInit {
  passwordForm: FormGroup;
  clienteId: number = 0

  constructor(private fb: FormBuilder,
    private servicio: NuevaContraseñaAdminService,
    private route: Router
  ) { }

  ngOnInit() {
    this.recolectarMetodos()
  }

  recolectarMetodos(){
    this.iniciarFormulario()
    this.extraerIdCliente()
  }

  extraerIdCliente() {
    let dataId = localStorage.getItem('Id de cliente');
    
    if (dataId) {
      this.clienteId = Number(dataId); // Convierte el valor a número directamente
    } else {
      console.error('No se encontró el ID del cliente en localStorage');
    }
  }
  

  iniciarFormulario(){
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Escuchar cambios en el campo de confirmación de la contraseña para actualizar el estado de coincidencia
    this.passwordForm.get('confirmPassword').valueChanges.subscribe(() => {
      // Actualiza el estado de coincidencia de las contraseñas
      this.passwordForm.updateValueAndValidity();
    });
  }

  // Validador personalizado para comparar contraseñas
  passwordMatchValidator(frm: FormGroup) {
    return frm.get('password').value === frm.get('confirmPassword').value
      ? null : { mismatch: true };
  }

  // Obtiene el estado de coincidencia de las contraseñas
  get passwordsMatch(): boolean {
    const password = this.passwordForm.get('password').value;
    const confirmPassword = this.passwordForm.get('confirmPassword').value;
    return password === confirmPassword;
  }

  async onSubmit() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;
      console.log('Nueva contraseña:', formData.password);
      try {
        const response = await this.servicio.nuevaContraseña(this.clienteId, formData.password);
        console.log('Respuesta del servidor:', response);
        if (response.success) {
          localStorage.removeItem('Id de cliente')
          this.route.navigate(['/logear-admin']);
        } else {
          throw new Error('No se ha podido cambiar la contraseña');
        }
      } catch (error) {
        console.log('Error de frontend: ', error);
      }
    }
  }
}