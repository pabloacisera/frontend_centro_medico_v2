import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResetearContraseñaAdminService } from './resetear-contraseña.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-resetar-contraseña',
  templateUrl: './resetar-contraseña.component.html',
  styleUrls: ['./resetar-contraseña.component.css']
})
export class ResetearContraseñaAdminComponent implements OnInit {

  idCliente: number = 0

  message: string = '';

  constructor(private readonly servicio: ResetearContraseñaAdminService, private router: Router) { }

  ngOnInit() {
  }

  data = {
    rol: '',
    email: ''
  };

  async onSubmit() {
    console.log('Datos del formulario:', this.data);
    try {
      const response = await this.servicio.solicitarReseteo(this.data);
      if (response.success) {
        console.log('Operación exitosa:', response);
        this.idCliente = response.data.id
        console.log('Id de cliente:', this.idCliente)
        localStorage.setItem('Id de cliente', this.idCliente.toString())
        this.router.navigate(['/new-password-admin']);
      } else {
        console.log('Error en la operación:', response);
        this.showErrorMessage('Los campos no coinciden con los datos alojados en la base de datos');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.showErrorMessage('Error al enviar el formulario.');
    }
  }

  showErrorMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
