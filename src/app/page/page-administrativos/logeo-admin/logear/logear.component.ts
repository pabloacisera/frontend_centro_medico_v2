import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LogearAdminService } from '../logear-admin.service';

@Component({
  standalone: true,
  selector: 'app-logear',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './logear.component.html',
  styleUrls: ['./logear.component.css']
})
export class LogearAdminComponent implements OnInit {
  
  public datosDeLogeo!: any;
  formularioDeLogeo!: FormGroup;

  constructor(private fb: FormBuilder, private ruta: Router, private servicio: LogearAdminService) {
    this.formularioDeLogeo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.formularioDeLogeo.valid) {
      const data = this.formularioDeLogeo.value;
      try {
        const response = await this.servicio.logearAdmin(data);
        console.log('Respuesta del servidor:', response);
        if (response && response.user) { // Ajusta a la respuesta esperada
          localStorage.setItem('userData', JSON.stringify(response.user));
          console.log('Paciente logeado exitosamente:', response.user);
          this.ruta.navigate(['/dashboard-admin']);
        } else {
          console.error('Respuesta inesperada del servidor:', response);
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
      }
    } else {
      console.error('Formulario inválido');
    }
  }  
}