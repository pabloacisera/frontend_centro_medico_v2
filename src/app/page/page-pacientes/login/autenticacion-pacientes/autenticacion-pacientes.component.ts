import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogearService } from './autenticacion-pacientes.service';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-autenticacion-pacientes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './autenticacion-pacientes.component.html',
  styleUrls: ['./autenticacion-pacientes.component.css']
})
export class AutenticacionPacientesComponent implements OnInit {
  public datosDeLogeo!: any;
  formularioDeLogeo!: FormGroup;

  constructor(private fb: FormBuilder, private peticion: LogearService, private ruta: Router) {

    this.formularioDeLogeo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.formularioDeLogeo.valid) {
      const data = this.formularioDeLogeo.value;
      this.peticion.registrar(data)
        .pipe(
          catchError(error => {
            console.error('Error al registrar usuario:', error);
            return throwError(() => new Error('Error al registrar usuario'));
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            if (response && response.access_token && response.data) {
              localStorage.setItem('token', response.access_token);
              localStorage.setItem('userData', JSON.stringify(response.data));
              console.log('Paciente logeado exitosamente:', response.data);
              this.ruta.navigate(['/dashboard-paciente']);
            } else {
              console.error('Respuesta inesperada del servidor:', response);
            }
          },
          error: (error) => {
            console.error('Error en la suscripción:', error);
          }
        });
    } else {
      console.error('Formulario inválido');
    }
  }

}
