import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetearContraseñaService } from './resetear-contraseña.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-resetar-contraseña',
  templateUrl: './resetar-contraseña.component.html',
  styleUrls: ['./resetar-contraseña.component.css']
})
export class ResetearContraseñaComponent implements OnInit {

  idUsuario: number = 0

  message: string = '';

  constructor(private readonly servicio: ResetearContraseñaService, private router: Router) { }

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
        this.idUsuario = response.data.id
        console.log('Id de usuario:', this.idUsuario)
        localStorage.setItem('Id de usuario', this.idUsuario.toString())
        this.router.navigate(['/new-password']);
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
